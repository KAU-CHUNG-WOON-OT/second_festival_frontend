import { useNavigate } from 'react-router-dom';
import { FiChevronLeft } from 'react-icons/fi';
import { useSidebar } from '../../contexts/SidebarContext';
import cheongunLogo from '../../assets/cheongun_logo.svg';
import menuIcon from '../../assets/home_menu.svg';

interface RetroPageHeaderProps {
  title?: string;
  // 뒤로가기 대신 사이드바 메뉴 버튼 (목록 페이지)
  showMenu?: boolean;
}

// 노을 배경 위 흰 아이콘 헤더: 메뉴 또는 뒤로가기 · (선택) 가운데 제목 · 청운 로고
const RetroPageHeader = ({ title, showMenu = false }: RetroPageHeaderProps) => {
  const navigate = useNavigate();
  const { openSidebar } = useSidebar();

  return (
    <div className="relative flex h-11 items-center justify-between text-paper">
      {showMenu ? (
        <button
          type="button"
          onClick={openSidebar}
          aria-label="메뉴 열기"
          className="-ml-3 flex size-11 items-center justify-center"
        >
          <img src={menuIcon} alt="" width={20} height={13} className="brightness-0 invert" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="뒤로"
          className="-ml-3 flex size-11 items-center justify-center"
        >
          <FiChevronLeft size={26} />
        </button>
      )}
      {title && (
        <h1 className="absolute left-1/2 max-w-[60%] -translate-x-1/2 truncate font-body-kr text-[16px] font-bold leading-6">
          {title}
        </h1>
      )}
      <img src={cheongunLogo} alt="청운" width={46} height={32} className="brightness-0 invert" />
    </div>
  );
};

export default RetroPageHeader;
