import { useEffect, useState, type FormEvent } from 'react';
import { FiInstagram, FiYoutube } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { markOnboardingSeenInCurrentTab } from '../lib/onboardingSession';
import { saveUserInfo, type StudentType } from '../lib/userInfoStorage';
import { ApiError, apiFetch } from '../lib/apiClient';
import { identify, setPeople, track } from '@/lib/mixpanel';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  return (
    <section className="relative -mt-[86px] flex h-full min-h-[874px] w-full flex-col overflow-hidden">
      <div className="relative h-[697px] w-full shrink-0 overflow-hidden">
        <span className="absolute left-[35px] top-[130px] rounded-[18px] border border-white/45 px-[20px] py-[6px] text-[19px] font-medium leading-none text-white backdrop-blur-[2px]">
          활공제
        </span>

        <h1 className="absolute left-[40px] top-[172px] text-[68px] font-light leading-[0.95] tracking-[-0.02em] text-white">
          정보입력
        </h1>

        <form
          onSubmit={handleFormSubmit}
          noValidate
          className="absolute left-1/2 top-[250px] w-[321px] -translate-x-1/2"
        >
          <input
            type="text"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="실명"
            aria-label="실명"
            className="h-[52px] w-full rounded-[20px] bg-white px-[20px] text-[20px] font-light text-[#111111] outline-none placeholder:text-[20px] placeholder:font-light placeholder:text-[#d9d9d9] focus:ring-2 focus:ring-[#5ea0ee]/35"
          />
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
            className={`mt-[14px] h-[52px] w-full rounded-[20px] bg-white px-[20px] text-[20px] font-light text-[#111111] outline-none placeholder:text-[20px] placeholder:font-light placeholder:text-[#d9d9d9] focus:ring-2 ${
              showStudentIdError
                ? 'ring-2 ring-[#dc2626]/60 focus:ring-[#dc2626]/60'
                : 'focus:ring-[#5ea0ee]/35'
            }`}
          />
          {showStudentIdError && (
            <p
              id="student-id-error"
              role="alert"
              className="mt-[6px] pl-[20px] text-[13px] font-medium text-[#fee2e2] drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]"
            >
              학번 형식에 맞지 않습니다
            </p>
          )}
          <input
            type="text"
            autoComplete="organization"
            value={department}
            onChange={(event) => setDepartment(event.target.value)}
            placeholder="학과"
            aria-label="학과"
            className="mt-[14px] h-[52px] w-full rounded-[20px] bg-white px-[20px] text-[20px] font-light text-[#111111] outline-none placeholder:text-[20px] placeholder:font-light placeholder:text-[#d9d9d9] focus:ring-2 focus:ring-[#5ea0ee]/35"
          />
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
            className={`mt-[14px] h-[52px] w-full rounded-[20px] bg-white px-[20px] text-[20px] font-light text-[#111111] outline-none placeholder:text-[20px] placeholder:font-light placeholder:text-[#d9d9d9] focus:ring-2 ${
              showEmailError
                ? 'ring-2 ring-[#dc2626]/60 focus:ring-[#dc2626]/60'
                : 'focus:ring-[#5ea0ee]/35'
            }`}
          />
          {showEmailError && (
            <p
              id="email-error"
              role="alert"
              className="mt-[6px] pl-[20px] text-[13px] font-medium text-[#fee2e2] drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]"
            >
              올바른 이메일 형식이 아닙니다 (예: name@kau.kr)
            </p>
          )}
          <div
            className="mt-[14px] grid h-[52px] grid-cols-3 gap-[4px] rounded-[20px] bg-white p-[4px]"
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
                  className={`rounded-[16px] text-[16px] font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#5ea0ee]/35 ${
                    selected ? 'bg-[#5ea0ee] text-white' : 'text-[#9ca3af]'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
          {errorMessage && (
            <p
              role="alert"
              className="mt-[14px] rounded-[16px] bg-white/90 px-[16px] py-[10px] text-center text-[14px] font-medium text-[#dc2626]"
            >
              {errorMessage}
            </p>
          )}
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="mt-[20px] h-[52px] w-full rounded-[20px] bg-[#5ea0ee] text-[20px] font-medium text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? '저장 중...' : '입력 완료'}
          </button>
        </form>
      </div>

      <footer className="relative z-10 mt-auto flex h-[177px] w-full shrink-0 flex-col items-center border-t border-[#e2e8f0] bg-white px-[16px] pt-[33px]">
        <p className="text-center text-[14px] font-semibold leading-[20px] tracking-[-0.1504px] text-[#314158]">
          한국항공대학교 제52대 총학생회 청운
        </p>

        <div className="mt-[16px] flex items-center gap-[12px]">
          <a
            href="https://www.youtube.com/@kau_students"
            target="_blank"
            rel="noreferrer"
            aria-label="유튜브"
            className="inline-flex size-[44px] items-center justify-center rounded-[14px] bg-[linear-gradient(135deg,#f1f5f9_0%,#e2e8f0_100%)] text-[#314158] shadow-[0_10px_15px_rgba(226,232,240,0.5),0_4px_6px_rgba(226,232,240,0.5)]"
          >
            <FiYoutube size={20} />
          </a>
          <a
            href="https://www.instagram.com/kau_students?igsh=MXRpNmF0MzA3MHZudA=="
            target="_blank"
            rel="noreferrer"
            aria-label="인스타그램"
            className="inline-flex size-[44px] items-center justify-center rounded-[14px] bg-[linear-gradient(135deg,#f1f5f9_0%,#e2e8f0_100%)] text-[#314158] shadow-[0_10px_15px_rgba(226,232,240,0.5),0_4px_6px_rgba(226,232,240,0.5)]"
          >
            <FiInstagram size={20} />
          </a>
        </div>

        <p className="mt-[16px] text-center text-[12px] font-medium leading-[16px] text-[#62748e]">
          Copyright©2024. Kau_Students. All rights reserved.
        </p>
      </footer>

      {isConfirmModalOpen && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/45 px-[16px] backdrop-blur-sm onboarding-backdrop-in"
          role="presentation"
          onClick={() => {
            if (!isSubmitting) setIsConfirmModalOpen(false);
          }}
        >
          <div
            className="relative w-full max-w-[340px] rounded-[20px] bg-white px-[20px] pb-[18px] pt-[22px] shadow-[0_24px_60px_rgba(15,23,42,0.28)] onboarding-modal-in"
            role="dialog"
            aria-modal="true"
            aria-labelledby="info-confirm-title"
            onClick={(event) => event.stopPropagation()}
          >
            <p
              id="info-confirm-title"
              className="text-center text-[28px] font-bold leading-none text-[#111111]"
            >
              주의
            </p>
            <p className="mt-[14px] break-keep text-center text-[15px] font-medium leading-[1.55] text-[#374151]">
              웹사이트 회원가입 시 본인의 실제 정보와 다른 정보를 기입한다면, 티켓 수령 불가를
              포함한 불이익이 있을 수 있습니다.
            </p>

            <div className="mt-[20px] flex items-center justify-between gap-[10px]">
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(false)}
                disabled={isSubmitting}
                className="h-[46px] flex-1 rounded-[14px] bg-[#eef2f7] text-[15px] font-semibold leading-none text-[#374151] transition-colors active:scale-[0.98] hover:bg-[#e2e8f0] disabled:cursor-not-allowed disabled:opacity-60"
              >
                취소
              </button>
              <button
                type="button"
                onClick={submitProfile}
                disabled={isSubmitting}
                className="h-[46px] flex-1 rounded-[14px] bg-[#5ea0ee] text-[15px] font-semibold leading-none text-white transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
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
