import { useNavigate } from 'react-router-dom';
import cheongunLogo from '../../assets/cheongun_logo.svg';

interface RetroPageHeaderProps {
  title?: string;
}

const RetroPageHeader = ({ title }: RetroPageHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between text-ink">
      <button
        type="button"
        onClick={() => navigate(-1)}
        aria-label="뒤로"
        className="flex size-11 items-center justify-center rounded-full border border-ink bg-paper font-typewriter text-[18px] leading-7 drop-shadow-[3px_3px_0px_var(--color-ink)]"
      >
        ←
      </button>
      {title && <h1 className="font-display text-[20px] leading-7">{title}</h1>}
      <img src={cheongunLogo} alt="청운" width={51} height={36} />
    </div>
  );
};

export default RetroPageHeader;
