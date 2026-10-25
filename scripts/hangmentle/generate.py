"""항멘틀 데이터 생성기.

fastText 한국어 벡터(cc.ko.300.vec)에서 자주 쓰는 명사(일반·고유명사, 대명사, 수사)만 골라 단어 목록을 만들고,
answers.txt의 정답 단어마다 모든 단어와의 코사인 유사도를 미리 계산해 public/hangmentle/에 저장한다.
blocklist.txt의 욕설·비하·선정적인 말은 단어 목록에서 뺀다.

준비:
  python3 -m venv .venv && .venv/bin/pip install numpy kiwipiepy
  # 벡터는 빈도순으로 정렬돼 있으므로 앞부분만 받아도 된다 (약 680MB)
  curl -sL https://dl.fbaipublicfiles.com/fasttext/vectors-crawl/cc.ko.300.vec.gz \
    | gunzip -c | head -n 300001 > cc.ko.300k.vec

실행:
  .venv/bin/python scripts/hangmentle/generate.py --vec cc.ko.300k.vec

출력:
  public/hangmentle/vocab.json        단어 목록 (빈도순)
  public/hangmentle/puzzles/<n>.json  정답 n번의 유사도 (vocab 순서, 유사도x10000 정수)

이벤트 모드:
  이벤트 회차는 백엔드에서 채점하므로 정답이 브라우저로 가면 안 된다.
  정답 파일은 저장소 바깥에 두고(한 줄에 하나, 순서가 회차 번호), 결과는 백엔드 저장소에 쓴다.
  이 모드는 public/hangmentle/을 건드리지 않는다.

  .venv/bin/python scripts/hangmentle/generate.py --vec cc.ko.300k.vec \
    --event-answers ~/hangmentle/event_answers.txt \
    --event-out ../second_festival_backend/src/main/resources/hangmentle

  <event-out>/vocab.json          단어 목록 (공개 정답도 넣어 만들므로 public과 같다)
  <event-out>/rounds/<n>.json     {"round": n, "answer": "정답", "sims": [...]} (sims 형식은 puzzles와 같다)

  정답은 이 저장소(공개)의 코드·주석·커밋 어디에도 적지 않는다.
  실수로 커밋되지 않도록 event_answers*로 시작하는 파일은 .gitignore에 넣어 두었다.

벡터 출처: fastText, Common Crawl 한국어 (CC BY-SA 3.0)
"""

import argparse
import json
import re
from pathlib import Path

import numpy as np
from kiwipiepy import Kiwi

ROOT = Path(__file__).resolve().parents[2]
HANGUL = re.compile(r"^[가-힣]{1,6}$")


def is_common_noun(kiwi: Kiwi, word: str) -> bool:
    # 조사·어미가 붙은 형태를 거르고 일반 명사 하나로만 분석되는 단어를 남긴다
    tokens = kiwi.tokenize(word)
    if len(tokens) == 1 and tokens[0].tag == "NNG" and tokens[0].form == word:
        return True
    # 한 글자는 관형사 등으로 읽히기 쉬워서('별'→관형사) 조사를 붙여 한 번 더 본다
    if len(word) == 1:
        tokens = kiwi.tokenize(word + "이")
        return len(tokens) == 2 and tokens[0].tag == "NNG" and tokens[0].form == word and tokens[1].tag.startswith("J")
    return False


# 단어 하나로 읽힐 때 받는 품사: 일반명사, 고유명사(서울·바다), 대명사(우리·여기), 수사(하나·둘)
WHOLE_WORD_TAGS = {"NNG", "NNP", "NP", "NR"}
# 감탄사·부사로 먼저 읽혀도 다음 후보로 이 품사가 나오면 받는다 (아이, 오늘, 지금)
ALTERNATIVE_TAGS = {"NNG", "NP", "NR"}
# 다음 후보는 가장 그럴듯한 분석과 점수가 이만큼 안에 있을 때만 본다
ALTERNATIVE_MARGIN = 6.0


def is_guessable_word(kiwi: Kiwi, word: str) -> bool:
    candidates = kiwi.analyze(word, top_n=4)
    tokens, best_score = candidates[0]
    # 조사·어미가 붙어 여러 형태소로 나뉘는 말(대한민국의, 아름다운)은 받지 않는다
    if len(tokens) == 1 and tokens[0].form == word:
        if tokens[0].tag in WHOLE_WORD_TAGS:
            return True
        for other, score in candidates[1:]:
            if score < best_score - ALTERNATIVE_MARGIN:
                break
            if len(other) == 1 and other[0].form == word and other[0].tag in ALTERNATIVE_TAGS:
                return True
    return is_common_noun(kiwi, word)


def load_blocklist(path: Path):
    exact: set[str] = set()
    contains: list[str] = []
    for line in path.read_text(encoding="utf-8").splitlines():
        entry = line.strip()
        if not entry or entry.startswith("#"):
            continue
        if entry.startswith("*"):
            contains.append(entry[1:])
        else:
            exact.add(entry)
    return lambda word: word in exact or any(part in word for part in contains)


def load_nouns(vec_path: Path, vocab_size: int, required: list[str], is_blocked):
    kiwi = Kiwi()
    words: list[str] = []
    vectors: list[np.ndarray] = []
    seen: set[str] = set()
    pending_required = set(required)

    with vec_path.open(encoding="utf-8") as f:
        next(f)  # 헤더: "<단어 수> <차원>"
        for line in f:
            word, rest = line.rstrip("\n").split(" ", 1)
            if word in seen or not HANGUL.match(word):
                continue
            is_required = word in pending_required
            if len(words) >= vocab_size and not is_required:
                if not pending_required:
                    break
                continue
            if not is_required and (is_blocked(word) or not is_guessable_word(kiwi, word)):
                continue
            vector = np.asarray(rest.split(" "), dtype=np.float32)
            # 크기가 0인 벡터는 유사도를 계산할 수 없다
            if not np.isfinite(vector).all() or np.linalg.norm(vector) < 1e-6:
                continue
            seen.add(word)
            pending_required.discard(word)
            words.append(word)
            vectors.append(vector)

    if pending_required:
        raise SystemExit(f"벡터 파일에 없는 정답 단어: {sorted(pending_required)}")

    matrix = np.vstack(vectors)
    matrix /= np.linalg.norm(matrix, axis=1, keepdims=True)
    return words, matrix


def read_word_list(path: Path) -> list[str]:
    return [w.strip() for w in path.read_text(encoding="utf-8").splitlines() if w.strip() and not w.startswith("#")]


def similarities(words: list[str], matrix: np.ndarray, index: dict, answer: str):
    # macOS Accelerate의 float32 행렬곱이 가짜 경고를 내므로 끄고, 값이 정상인지 직접 확인한다
    with np.errstate(all="ignore"):
        sims = matrix @ matrix[index[answer]]
    assert np.isfinite(sims).all(), f"{answer}: 유사도에 비정상 값이 있음"
    scaled = np.rint(np.clip(sims, -1, 1) * 10000).astype(int).tolist()
    top = np.argsort(-sims)[1:6]
    nearest = ", ".join(f"{words[i]}({sims[i] * 100:.1f})" for i in top)
    return scaled, nearest


def reset_dir(path: Path):
    # 정답을 줄였을 때 예전 파일이 남지 않도록 비우고 새로 쓴다
    path.mkdir(parents=True, exist_ok=True)
    for old in path.glob("*.json"):
        old.unlink()


def write_vocab(out: Path, words: list[str]):
    (out / "vocab.json").write_text(json.dumps(words, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")


def write_event(args, answers: list[str]):
    event_answers = read_word_list(args.event_answers)
    if not event_answers:
        raise SystemExit(f"이벤트 정답이 비어 있음: {args.event_answers}")
    if len(set(event_answers)) != len(event_answers):
        raise SystemExit("이벤트 정답에 같은 단어가 두 번 있음")
    # 공개 문제의 정답은 puzzles/<n>.json의 10000에서 바로 드러나므로 이벤트 정답으로 쓰면 안 된다
    if set(event_answers) & set(answers):
        raise SystemExit("이벤트 정답이 answers.txt의 공개 정답과 겹침")
    # public/ 아래는 그대로 배포되므로 이벤트 결과를 쓰지 않는다
    event_out = args.event_out.resolve()
    if event_out.is_relative_to((ROOT / "public").resolve()):
        raise SystemExit(f"--event-out은 public/ 바깥이어야 함: {args.event_out}")

    # 공개 정답도 필수 단어로 넣어야 일반 모드와 같은 단어 목록이 나온다
    required = answers + [w for w in event_answers if w not in answers]
    words, matrix = load_nouns(args.vec, args.vocab_size, required, load_blocklist(args.blocklist))
    index = {w: i for i, w in enumerate(words)}

    rounds_dir = event_out / "rounds"
    reset_dir(rounds_dir)
    write_vocab(event_out, words)

    for n, answer in enumerate(event_answers, start=1):
        scaled, nearest = similarities(words, matrix, index, answer)
        round_data = {"round": n, "answer": answer, "sims": scaled}
        (rounds_dir / f"{n}.json").write_text(json.dumps(round_data, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
        print(f"{n:>2}회차 {answer}: {nearest}")

    print(f"단어 {len(words)}개, 이벤트 {len(event_answers)}회차 → {event_out}")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--vec", type=Path, required=True)
    parser.add_argument("--answers", type=Path, default=Path(__file__).with_name("answers.txt"))
    parser.add_argument("--out", type=Path, default=ROOT / "public" / "hangmentle")
    parser.add_argument("--blocklist", type=Path, default=Path(__file__).with_name("blocklist.txt"))
    parser.add_argument("--vocab-size", type=int, default=40000)
    parser.add_argument("--event-answers", type=Path, help="이벤트 정답 파일 (저장소 바깥, 한 줄에 하나, 순서가 회차)")
    parser.add_argument("--event-out", type=Path, help="이벤트 결과를 쓸 폴더 (백엔드 리소스)")
    args = parser.parse_args()

    answers = read_word_list(args.answers)

    if args.event_answers or args.event_out:
        if not (args.event_answers and args.event_out):
            parser.error("--event-answers와 --event-out은 함께 써야 한다")
        write_event(args, answers)
        return

    words, matrix = load_nouns(args.vec, args.vocab_size, answers, load_blocklist(args.blocklist))
    index = {w: i for i, w in enumerate(words)}

    puzzles_dir = args.out / "puzzles"
    reset_dir(puzzles_dir)
    write_vocab(args.out, words)

    for n, answer in enumerate(answers, start=1):
        scaled, nearest = similarities(words, matrix, index, answer)
        (puzzles_dir / f"{n}.json").write_text(json.dumps({"sims": scaled}, separators=(",", ":")), encoding="utf-8")
        print(f"{n:>2} {answer}: {nearest}")

    print(f"단어 {len(words)}개, 정답 {len(answers)}개 → {args.out}")


if __name__ == "__main__":
    main()
