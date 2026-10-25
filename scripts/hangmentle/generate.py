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


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--vec", type=Path, required=True)
    parser.add_argument("--answers", type=Path, default=Path(__file__).with_name("answers.txt"))
    parser.add_argument("--out", type=Path, default=ROOT / "public" / "hangmentle")
    parser.add_argument("--blocklist", type=Path, default=Path(__file__).with_name("blocklist.txt"))
    parser.add_argument("--vocab-size", type=int, default=40000)
    args = parser.parse_args()

    answers = [w.strip() for w in args.answers.read_text(encoding="utf-8").splitlines() if w.strip() and not w.startswith("#")]
    words, matrix = load_nouns(args.vec, args.vocab_size, answers, load_blocklist(args.blocklist))
    index = {w: i for i, w in enumerate(words)}

    puzzles_dir = args.out / "puzzles"
    puzzles_dir.mkdir(parents=True, exist_ok=True)
    for old in puzzles_dir.glob("*.json"):
        old.unlink()

    (args.out / "vocab.json").write_text(json.dumps(words, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")

    for n, answer in enumerate(answers, start=1):
        # macOS Accelerate의 float32 행렬곱이 가짜 경고를 내므로 끄고, 값이 정상인지 직접 확인한다
        with np.errstate(all="ignore"):
            sims = matrix @ matrix[index[answer]]
        assert np.isfinite(sims).all(), f"{answer}: 유사도에 비정상 값이 있음"
        scaled = np.rint(np.clip(sims, -1, 1) * 10000).astype(int).tolist()
        (puzzles_dir / f"{n}.json").write_text(json.dumps({"sims": scaled}, separators=(",", ":")), encoding="utf-8")
        top = np.argsort(-sims)[1:6]
        print(f"{n:>2} {answer}: " + ", ".join(f"{words[i]}({sims[i] * 100:.1f})" for i in top))

    print(f"단어 {len(words)}개, 정답 {len(answers)}개 → {args.out}")


if __name__ == "__main__":
    main()
