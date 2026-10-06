import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import RetroPageHeader from '../components/common/RetroPageHeader';
import { markOnboardingSeenInCurrentTab } from '../lib/onboardingSession';
import { saveUserInfo, type StudentType } from '../lib/userInfoStorage';
import { ApiError, apiFetch } from '../lib/apiClient';
import { identify, setPeople, track } from '@/lib/mixpanel';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INPUT_BASE =
  'h-14 w-full rounded-full border-2 bg-cream px-5 font-body-kr text-[18px] outline-none placeholder:text-ink/40';

const InfoInputPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [department, setDepartment] = useState('');
  const [email, setEmail] = useState('');
  const [studentIdTouched, setStudentIdTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [studentType, setStudentType] = useState<StudentType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const trimmedName = name.trim();
  const trimmedStudentId = studentId.trim();
  const trimmedDepartment = department.trim();
  const trimmedEmail = email.trim();
  const isStudentIdValid = /^\d{10}$/.test(trimmedStudentId);
  const showStudentIdError = studentIdTouched && trimmedStudentId.length > 0 && !isStudentIdValid;
  const isEmailValid = EMAIL_REGEX.test(trimmedEmail);
  const showEmailError = emailTouched && trimmedEmail.length > 0 && !isEmailValid;
  const isValid =
    trimmedName.length > 0 &&
    isStudentIdValid &&
    trimmedDepartment.length > 0 &&
    isEmailValid &&
    studentType !== null;

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid || isSubmitting) return;
    setErrorMessage(null);
    setIsConfirmModalOpen(true);
  };

  const submitProfile = async () => {
    if (!isValid || isSubmitting || studentType === null) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await apiFetch('/api/users/me/profile', {
        method: 'POST',
        body: {
          name: trimmedName,
          studentId: trimmedStudentId,
          department: trimmedDepartment,
          email: trimmedEmail,
          studentType,
        },
      });
      saveUserInfo({
        name: trimmedName,
        studentId: trimmedStudentId,
        email: trimmedEmail,
        department: trimmedDepartment,
        studentType,
      });
      identify(trimmedStudentId);
      setPeople({ $name: trimmedName, department: trimmedDepartment, student_type: studentType });
      track('user_info_submitted', { student_type: studentType });
      markOnboardingSeenInCurrentTab();
      navigate('/home', { replace: true });
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message || '정보 등록에 실패했습니다. 잠시 후 다시 시도해주세요.'
          : '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      setErrorMessage(message);
      setIsConfirmModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!isConfirmModalOpen) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isSubmitting) {
        setIsConfirmModalOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isConfirmModalOpen, isSubmitting]);

  const inputClass = (hasError = false) =>
    `${INPUT_BASE} ${hasError ? 'border-rust' : 'border-ink'}`;

  // 시안이 없어 온보딩·팔찌 화면의 입력 스타일로 맞춤
  return (
    <section className="flex flex-col px-5 pb-16 pt-5 text-ink">
      <RetroPageHeader />

      <div className="pt-8">
        <span className="inline-flex h-[38px] items-center rounded-full border border-ink bg-mustard px-4 font-display text-[18px] leading-7">
          활주로
        </span>
      </div>
      <h1 className="pt-2 font-display text-[60px] leading-[60px]">정보입력</h1>
      <p className="pt-2 font-typewriter text-[12px] leading-4 tracking-[3.6px]">PASSENGER INFO</p>

      <form
        onSubmit={handleFormSubmit}
        noValidate
        className="mt-6 flex flex-col gap-[14px] rounded-[24px] border-2 border-ink bg-paper p-6 shadow-[6px_6px_0px_0px_var(--color-ink)]"
      >
        <input
          type="text"
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="실명"
          aria-label="실명"
          className={inputClass()}
        />
        <div>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={studentId}
            onChange={(event) => {
              const onlyDigits = event.target.value.replace(/\D/g, '').slice(0, 10);
              setStudentId(onlyDigits);
            }}
            onBlur={() => setStudentIdTouched(true)}
            placeholder="학번"
            aria-label="학번"
            aria-invalid={showStudentIdError}
            aria-describedby={showStudentIdError ? 'student-id-error' : undefined}
            className={inputClass(showStudentIdError)}
          />
          {showStudentIdError && (
            <p id="student-id-error" role="alert" className="pl-5 pt-[6px] font-body-kr text-[13px] font-bold text-rust">
              학번 형식에 맞지 않습니다
            </p>
          )}
        </div>
        <input
          type="text"
          autoComplete="organization"
          value={department}
          onChange={(event) => setDepartment(event.target.value)}
          placeholder="학과"
          aria-label="학과"
          className={inputClass()}
        />
        <div>
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            onBlur={() => setEmailTouched(true)}
            placeholder="이메일"
            aria-label="이메일"
            aria-invalid={showEmailError}
            aria-describedby={showEmailError ? 'email-error' : undefined}
            className={inputClass(showEmailError)}
          />
          {showEmailError && (
            <p id="email-error" role="alert" className="pl-5 pt-[6px] font-body-kr text-[13px] font-bold text-rust">
              올바른 이메일 형식이 아닙니다 (예: name@kau.kr)
            </p>
          )}
        </div>
        <div
          className="grid h-14 grid-cols-3 gap-1 rounded-full border-2 border-ink bg-cream p-1"
          role="radiogroup"
          aria-label="학적"
        >
          {(
            [
              { value: 'UNDERGRADUATE', label: '재학생' },
              { value: 'ON_LEAVE', label: '휴학생' },
              { value: 'GRADUATE', label: '대학원생' },
            ] as const
          ).map((option) => {
            const selected = studentType === option.value;
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setStudentType(option.value)}
                className={`rounded-full font-display text-[16px] ${selected ? 'bg-ink text-paper' : 'text-ink/50'}`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
        {errorMessage && (
          <p
            role="alert"
            className="rounded-[16px] border-2 border-rust bg-cream px-4 py-[10px] text-center font-body-kr text-[14px] font-bold text-rust"
          >
            {errorMessage}
          </p>
        )}
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="mt-2 h-16 w-full rounded-[16px] border-2 border-ink bg-rust font-display text-[20px] leading-7 text-paper drop-shadow-[4px_4px_0px_var(--color-ink)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? '저장 중...' : '입력 완료'}
        </button>
      </form>

      {isConfirmModalOpen && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-ink/50 px-4 onboarding-backdrop-in"
          role="presentation"
          onClick={() => {
            if (!isSubmitting) setIsConfirmModalOpen(false);
          }}
        >
          <div
            className="relative w-full max-w-[340px] rounded-[20px] border-2 border-ink bg-paper px-5 pb-5 pt-6 text-ink drop-shadow-[6px_6px_0px_var(--color-ink)] onboarding-modal-in"
            role="dialog"
            aria-modal="true"
            aria-labelledby="info-confirm-title"
            onClick={(event) => event.stopPropagation()}
          >
            <p id="info-confirm-title" className="text-center font-display text-[28px] leading-none">
              주의
            </p>
            <p className="mt-4 break-keep text-center font-body-kr text-[15px] leading-[1.55]">
              웹사이트 회원가입 시 본인의 실제 정보와 다른 정보를 기입한다면, 티켓 수령 불가를
              포함한 불이익이 있을 수 있습니다.
            </p>

            <div className="mt-5 flex items-center justify-between gap-[10px]">
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(false)}
                disabled={isSubmitting}
                className="h-[46px] flex-1 rounded-[14px] border-2 border-ink bg-cream font-body-kr text-[15px] font-semibold disabled:cursor-not-allowed disabled:opacity-60"
              >
                취소
              </button>
              <button
                type="button"
                onClick={submitProfile}
                disabled={isSubmitting}
                className="h-[46px] flex-1 rounded-[14px] border-2 border-ink bg-ink font-body-kr text-[15px] font-semibold text-paper disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? '저장 중...' : '확인'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default InfoInputPage;
