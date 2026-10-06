import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useLikes } from '../../hooks/useLikes';
import { apiFetch } from '@/lib/apiClient';
import { isAuthenticated } from '@/lib/authStorage';
import { track } from '@/lib/mixpanel';
import LoginRequiredPopup from './LoginRequiredPopup';
import logoImg from '../../assets/cheongun_logo.svg';

export interface MenuItem {
  id: number;
  name: string;
  name_en?: string;
  price: string;
  image?: string;
  likes?: number;
}

interface MenuLikeData {
  likeCount: number;
  likedByMe: boolean;
}

export interface InitialMenuLike {
  likeCount: number;
  likedByMe: boolean;
}

interface MenuListProps {
  menu: MenuItem[];
  showLikes?: boolean;
  likePrefix?: 'bar' | 'menu' | string;
  /** 외부에서 좋아요 초기 데이터를 주입하면 메뉴별 GET을 건너뜁니다. */
  initialLikesData?: Record<number, InitialMenuLike>;
  // 카드 제목 (예: '판매 · 참여 항목'). 없으면 '— MENU —'
  title?: string;
}

const MenuList = ({
  menu,
  showLikes = true,
  likePrefix = 'menu',
  initialLikesData,
  title,
}: MenuListProps) => {
  const { language } = useLanguage();
  const { isLiked, toggle } = useLikes(likePrefix);

  const [likeCounts, setLikeCounts] = useState<Record<number, number>>(
    Object.fromEntries(menu.map((item) => [item.id, item.likes ?? 0])),
  );
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [animatingIds, setAnimatingIds] = useState<Set<number>>(new Set());

  const apiPath = likePrefix === 'bar' ? 'bars' : 'menus';

  const handleKakaoLogin = () => {
    const apiBase = import.meta.env.VITE_API_BASE_URL;
    if (!apiBase) {
      console.error('VITE_API_BASE_URL is not configured.');
      return;
    }
    track('menu_like_kakao_login_clicked');
    const trimmed = apiBase.endsWith('/') ? apiBase.slice(0, -1) : apiBase;
    window.location.href = `${trimmed}/oauth2/authorization/kakao`;
  };

  useEffect(() => {
    if (menu.length === 0 || !showLikes) return;

    // 외부에서 좋아요 데이터를 주입받은 경우 — 개별 GET 호출 생략
    if (initialLikesData) {
      setLikeCounts((prev) => {
        const next = { ...prev };
        menu.forEach((item) => {
          const data = initialLikesData[item.id];
          if (!data) return;
          next[item.id] = data.likeCount;
          if (data.likedByMe !== isLiked(item.id)) toggle(item.id);
        });
        return next;
      });
      return;
    }

    const fetchInitialLikes = async () => {
      try {
        const results = await Promise.all(
          menu.map((item) =>
            apiFetch<MenuLikeData>(`/api/${apiPath}/${item.id}`)
              .then((data) => ({ id: item.id, data }))
              .catch(() => null),
          ),
        );

        setLikeCounts((prev) => {
          const next = { ...prev };
          results.forEach((res) => {
            if (!res) return;
            next[res.id] = res.data.likeCount;
            if (res.data.likedByMe !== isLiked(res.id)) toggle(res.id);
          });
          return next;
        });
      } catch (error) {
        console.error('최신 데이터를 불러오는데 실패했습니다:', error);
      }
    };

    fetchInitialLikes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menu, likePrefix, showLikes, initialLikesData]);

  const triggerAnimation = (id: number) => {
    setAnimatingIds((prev) => new Set(prev).add(id));
    setTimeout(() => {
      setAnimatingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 400);
  };

  const handleLike = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();

    if (!isAuthenticated()) {
      setIsLoginPopupOpen(true);
      return;
    }

    triggerAnimation(id);

    const currentlyLiked = isLiked(id);
    toggle(id);
    setLikeCounts((prev) => ({
      ...prev,
      [id]: prev[id] + (currentlyLiked ? -1 : 1),
    }));

    try {
      const data = await apiFetch<MenuLikeData>(`/api/${apiPath}/${id}/likes`, {
        method: 'POST',
      });
      setLikeCounts((prev) => ({ ...prev, [id]: data.likeCount }));
    } catch (error) {
      console.error('좋아요 토글 실패:', error);
      toggle(id);
      setLikeCounts((prev) => ({
        ...prev,
        [id]: prev[id] + (currentlyLiked ? 1 : -1),
      }));
      alert('좋아요 처리에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  if (menu.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes heartPop {
          0%   { transform: scale(1); }
          30%  { transform: scale(1.5); }
          60%  { transform: scale(0.85); }
          100% { transform: scale(1); }
        }
        .heart-pop { animation: heartPop 0.4s ease; }
      `}</style>

      <section className="rounded-[16px] border-2 border-ink bg-paper p-5 text-ink drop-shadow-[5px_5px_0px_var(--color-ink)]">
        {title ? (
          <h2 className="font-display text-[20px] leading-7">{title}</h2>
        ) : (
          <h2 className="font-typewriter text-[12px] leading-4 tracking-[3.6px]">— MENU —</h2>
        )}
        <ul className="pt-2">
          {menu.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-3 border-b border-dashed border-ink/40 py-4 last:border-b-0"
            >
              <img
                src={item.image || logoImg}
                alt=""
                onError={(e) => {
                  e.currentTarget.src = logoImg;
                }}
                className="size-8 shrink-0 rounded-[4px] object-contain"
              />
              <span className="min-w-0 flex-1 font-display text-[18px] leading-7">
                {language === 'ENG' && item.name_en ? item.name_en : item.name}
              </span>
              <span className="shrink-0 font-typewriter text-[18px] font-bold leading-7">
                {item.price}
              </span>
              {showLikes && (
                <button
                  type="button"
                  onClick={(e) => handleLike(e, item.id)}
                  aria-label="좋아요"
                  className="flex shrink-0 items-center gap-1 font-typewriter text-[12px] font-bold"
                >
                  <span
                    className={`text-rust ${animatingIds.has(item.id) ? 'heart-pop inline-block' : ''}`}
                  >
                    {isLiked(item.id) ? '♥' : '♡'}
                  </span>
                  {likeCounts[item.id]}
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>

      {isLoginPopupOpen && (
        <LoginRequiredPopup
          onCancel={() => setIsLoginPopupOpen(false)}
          onLogin={handleKakaoLogin}
        />
      )}
    </>
  );
};

export default MenuList;
