import { useState, useEffect } from 'react';
import { RiKakaoTalkFill } from 'react-icons/ri';
import { useLanguage } from '../../contexts/LanguageContext';
import { useLikes } from '../../hooks/useLikes';
import { apiFetch } from '@/lib/apiClient';
import { isAuthenticated } from '@/lib/authStorage';
import { track } from '@/lib/mixpanel';

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
}

const MenuList = ({ menu, showLikes = true, likePrefix = 'menu', initialLikesData }: MenuListProps) => {
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

      <div className="flex flex-col gap-2.5">
        {menu.map((item) => (
          <div
            key={item.id}
            className="bg-white/60 backdrop-blur-sm rounded-2xl px-5 py-4 border border-white/40 flex items-center gap-4"
          >
            <div className="w-14 h-14 flex-shrink-0">
              {item.image && (
                <div className="w-full h-full rounded-xl bg-white/50 overflow-hidden flex items-center justify-center">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <span className="text-[13px] font-semibold text-[#2B3A5C] flex-1">
              {language === 'ENG' && item.name_en ? item.name_en : item.name}
            </span>

            <div className="flex items-center gap-3">
              <span className="text-[13px] font-bold text-[#4A7FD2]">{item.price}</span>
              {showLikes && (
                <button onClick={(e) => handleLike(e, item.id)} className="flex items-center gap-1">
                  <svg
                    className={`w-4.5 h-4.5 ${animatingIds.has(item.id) ? 'heart-pop' : ''}`}
                    fill={isLiked(item.id) ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{ color: '#f87171' }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="text-[11px] font-medium text-[#8a94a6]">
                    {likeCounts[item.id]}
                  </span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {isLoginPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center pb-8 bg-black/20 backdrop-blur-[2px]">
          <div className="relative w-[280px]">
            <div className="absolute inset-x-0 bottom-[-8px] h-[18px] rounded-b-[18px] bg-[#8aa4d4]/60" />
            <div className="relative rounded-[20px] bg-white/95 backdrop-blur-md px-5 pb-4 pt-5 shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
              <p className="text-center text-[13px] font-bold text-[#2B3A5C] mb-3">
                로그인이 필요한 서비스예요
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsLoginPopupOpen(false)}
                  className="h-[38px] flex-1 rounded-[12px] bg-[#f1f3f6] text-[13px] font-bold text-[#8a94a6] active:scale-[0.98] transition-transform"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleKakaoLogin}
                  className="flex h-[38px] flex-1 items-center justify-center gap-1.5 rounded-[12px] bg-[#fae300] text-[13px] font-bold text-[#111111] shadow-[0_4px_12px_rgba(0,0,0,0.08)] active:scale-[0.98] transition-transform"
                >
                  <RiKakaoTalkFill className="size-[16px]" />
                  카카오 로그인
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MenuList;