import { useState } from 'react';
import logoImg from '../assets/logo.svg';
import { useTimeOfDay } from '../hooks/useTimeOfDay';
import { useLanguage } from '../contexts/LanguageContext';

type TabKey = 'dev' | 'planning' | 'translation';

const DevSection = ({ isEng }: { isEng: boolean }) => (
  <>
    <div className="mb-8 w-full">
      <div className="mb-8 inline-block rounded-full bg-[#3F4A59] px-5 py-1.5 text-xs font-bold text-white shadow-md">
        PM/Design
      </div>
      <div className="mx-auto grid w-full max-w-[220px] grid-cols-2 gap-y-8">
        <div className="col-span-2 flex flex-col items-center">
          <span className="mb-1 text-[11px] font-bold text-black">
            {isEng ? 'Student President' : '총학생회장'}
          </span>
          <span className="mb-0.5 text-lg font-black text-black">홍석담</span>
          <span className="text-[11px] font-medium text-black">
            {isEng ? "Business '22" : '경영학부 22'}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="mb-1 text-[11px] font-bold text-black">
            {isEng ? 'Vice President' : '부총학생회장'}
          </span>
          <span className="mb-0.5 text-lg font-black text-black">주민재</span>
          <span className="text-[11px] font-medium text-black">
            {isEng ? "Software '24" : '소프트웨어 24'}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="mb-1 text-[11px] font-bold text-black">
            {isEng ? 'Dev Lead' : '개발실장/PL'}
          </span>
          <span className="mb-0.5 text-lg font-black text-black">윤정민</span>
          <span className="text-[11px] font-medium text-black">
            {isEng ? "Software '23" : '소프트웨어 23'}
          </span>
        </div>
      </div>
    </div>

    <div className="mb-14 w-full">
      <div className="mb-8 inline-block rounded-full bg-[#3F4A59] px-5 py-1.5 text-xs font-bold text-white shadow-md">
        Developer
      </div>
      <div className="mx-auto grid w-full max-w-[220px] grid-cols-2 gap-y-8">
        <div className="flex flex-col items-center">
          <span className="mb-1 text-[11px] font-bold text-black">Dev Lead</span>
          <span className="mb-0.5 text-lg font-black text-black">윤정민</span>
          <span className="text-[11px] font-medium text-black">
            {isEng ? "Software '23" : '소프트웨어 23'}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="mb-1 text-[11px] font-bold text-black">
            {isEng ? 'Dev TF' : '개발실TF'}
          </span>
          <span className="mb-0.5 text-lg font-black text-black">이상원</span>
          <span className="text-[11px] font-medium text-black">
            {isEng ? "Software '21" : '소프트웨어 21'}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="mb-1 text-[11px] font-bold text-black">
            {isEng ? 'Dev TF' : '개발실TF'}
          </span>
          <span className="mb-0.5 text-lg font-black text-black">서준익</span>
          <span className="text-[11px] font-medium text-black">
            {isEng ? "Software '21" : '소프트웨어 21'}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="mb-1 text-[11px] font-bold text-black">
            {isEng ? 'Dev TF' : '개발실TF'}
          </span>
          <span className="mb-0.5 text-lg font-black text-black">신영섭</span>
          <span className="text-[11px] font-medium text-black">
            {isEng ? "Software '21" : '소프트웨어 21'}
          </span>
        </div>
      </div>
    </div>
  </>
);

const PlanningSection = ({ isEng }: { isEng: boolean }) => (
  <>
    <div className="mb-8 w-full">
      <div className="mb-8 inline-block rounded-full bg-[#3F4A59] px-5 py-1.5 text-xs font-bold text-white shadow-md">
        Executive
      </div>
      <div className="mx-auto grid w-full max-w-[220px] grid-cols-2 gap-y-8">
        <div className="flex flex-col items-center">
          <span className="mb-1 text-[11px] font-bold text-black">
            {isEng ? 'President' : '총학생회장'}
          </span>
          <span className="mb-0.5 text-lg font-black text-black">홍석담</span>
          <span className="text-[11px] font-medium text-black">
            {isEng ? "Business '22" : '경영 22'}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="mb-1 text-[11px] font-bold text-black">
            {isEng ? 'Vice President' : '부총학생회장'}
          </span>
          <span className="mb-0.5 text-lg font-black text-black">주민재</span>
          <span className="text-[11px] font-medium text-black">
            {isEng ? "Software '24" : '소프트 24'}
          </span>
        </div>
      </div>
    </div>

    <div className="mb-8 w-full">
      <div className="mb-8 inline-block rounded-full bg-[#3F4A59] px-5 py-1.5 text-xs font-bold text-white shadow-md">
        Director
      </div>
      <div className="mx-auto grid w-full max-w-[220px] grid-cols-2 gap-y-8">
        <div className="flex flex-col items-center">
          <span className="mb-1 text-[11px] font-bold text-black">
            {isEng ? 'Policy' : '정책국장'}
          </span>
          <span className="mb-0.5 text-lg font-black text-black">이나라</span>
          <span className="text-[11px] font-medium text-black">
            {isEng ? "Business '21" : '경영 21'}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="mb-1 text-[11px] font-bold text-black">
            {isEng ? 'Partnership' : '협력국장'}
          </span>
          <span className="mb-0.5 text-lg font-black text-black">장현진</span>
          <span className="text-[11px] font-medium text-black">
            {isEng ? "Aerospace '20" : '항우기 20'}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="mb-1 text-[11px] font-bold text-black">
            {isEng ? 'Planning' : '기획국장'}
          </span>
          <span className="mb-0.5 text-lg font-black text-black">이승주</span>
          <span className="text-[11px] font-medium text-black">
            {isEng ? "Software '23" : '소프트웨어 23'}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="mb-1 text-[11px] font-bold text-black">
            {isEng ? 'Culture' : '문화국장'}
          </span>
          <span className="mb-0.5 text-lg font-black text-black">최성훈</span>
          <span className="text-[11px] font-medium text-black">
            {isEng ? "Transport '23" : '교통 23'}
          </span>
        </div>
        <div className="col-span-2 flex flex-col items-center">
          <span className="mb-1 text-[11px] font-bold text-black">
            {isEng ? 'Promotion' : '홍보국장'}
          </span>
          <span className="mb-0.5 text-lg font-black text-black">최길웅</span>
          <span className="text-[11px] font-medium text-black">
            {isEng ? "Auto Drive '22" : '자율주행 22'}
          </span>
        </div>
      </div>
    </div>

    <div className="mb-14 w-full">
      <div className="mb-8 inline-block rounded-full bg-[#3F4A59] px-5 py-1.5 text-xs font-bold text-white shadow-md">
        Office
      </div>
      <div className="mx-auto grid w-full max-w-[220px] grid-cols-2 gap-y-8">
        <div className="col-span-2 flex flex-col items-center">
          <span className="mb-1 text-[11px] font-bold text-black">
            {isEng ? 'Executive Chair' : '집행위원장'}
          </span>
          <span className="mb-0.5 text-lg font-black text-black">김가빈</span>
          <span className="text-[11px] font-medium text-black">
            {isEng ? "Business '23" : '경영 23'}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="mb-1 text-[11px] font-bold text-black">
            {isEng ? 'Budget' : '예산실'}
          </span>
          <span className="mb-0.5 text-lg font-black text-black">강미주</span>
          <span className="text-[11px] font-medium text-black">
            {isEng ? "Auto Drive '24" : '자율주행 24'}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="mb-1 text-[11px] font-bold text-black">{isEng ? 'PR' : '공보실'}</span>
          <span className="mb-0.5 text-lg font-black text-black">윤여범</span>
          <span className="text-[11px] font-medium text-black">
            {isEng ? "Transport '22" : '교통 22'}
          </span>
        </div>
        <div className="col-span-2 flex flex-col items-center">
          <span className="mb-1 text-[11px] font-bold text-black">
            {isEng ? 'Dev Office' : '개발실'}
          </span>
          <span className="mb-0.5 text-lg font-black text-black">윤정민</span>
          <span className="text-[11px] font-medium text-black">
            {isEng ? "Software '23" : '소프트 23'}
          </span>
        </div>
      </div>
    </div>
  </>
);

const TranslationSection = ({ isEng }: { isEng: boolean }) => (
  <div className="mb-14 w-full">
    <div className="mb-8 inline-block rounded-full bg-[#3F4A59] px-5 py-1.5 text-xs font-bold text-white shadow-md">
      Translation
    </div>
    <div className="mx-auto grid w-full max-w-[220px] grid-cols-2 gap-y-8">
      <div className="flex flex-col items-center">
        <span className="mb-1 text-[11px] font-bold text-black">
          {isEng ? 'Translator' : '번역'}
        </span>
        <span className="mb-0.5 text-lg font-black text-black">정재현</span>
        <span className="text-[11px] font-medium text-black">
          {isEng ? "Business '23" : '경영 23'}
        </span>
      </div>
      <div className="flex flex-col items-center">
        <span className="mb-1 text-[11px] font-bold text-black">
          {isEng ? 'Translator' : '번역'}
        </span>
        <span className="mb-0.5 text-lg font-black text-black">류영채</span>
        <span className="text-[11px] font-medium text-black">
          {isEng ? "Transport '24" : '교물 24'}
        </span>
      </div>
      <div className="col-span-2 flex flex-col items-center">
        <span className="mb-1 text-[11px] font-bold text-black">
          {isEng ? 'Translator' : '번역'}
        </span>
        <span className="mb-0.5 text-lg font-black text-black">김하은</span>
        <span className="text-[11px] font-medium text-black">
          {isEng ? "Smart Drone '26" : '스드공 26'}
        </span>
      </div>
    </div>
  </div>
);

const Makers = () => {
  const timeOfDay = useTimeOfDay();
  const { language } = useLanguage();
  const isEng = language === 'ENG';
  const isMorning = timeOfDay === 'morning' || timeOfDay === 'afternoon';
  const [tab, setTab] = useState<TabKey>('dev');

  return (
    <div className="no-scrollbar flex h-full w-full flex-col items-center overflow-y-auto px-7 pb-10 pt-10 text-center">
      <div className="mb-8 flex flex-col items-center">
        <div
          className={`mb-5 h-24 w-24 ${isMorning ? 'bg-[#364153]' : 'bg-gray-200'}`}
          style={{
            maskImage: `url(${logoImg})`,
            WebkitMaskImage: `url(${logoImg})`,
            maskSize: 'contain',
            WebkitMaskSize: 'contain',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskPosition: 'center',
          }}
        />

        {/* 탭 버튼 */}
        <div className="mb-5 flex gap-1 rounded-full bg-black/10 p-1 backdrop-blur-sm">
          <button
            onClick={() => setTab('dev')}
            className={`rounded-full px-5 py-1.5 text-xs font-bold transition-all duration-200 ${
              tab === 'dev' ? 'bg-[#3F4A59] text-white shadow-md' : 'text-black/70'
            }`}
          >
            {isEng ? 'Developer' : '개발자'}
          </button>
          <button
            onClick={() => setTab('planning')}
            className={`rounded-full px-5 py-1.5 text-xs font-bold transition-all duration-200 ${
              tab === 'planning' ? 'bg-[#3F4A59] text-white shadow-md' : 'text-black/70'
            }`}
          >
            {isEng ? 'Planning' : '축제기획'}
          </button>
          <button
            onClick={() => setTab('translation')}
            className={`rounded-full px-5 py-1.5 text-xs font-bold transition-all duration-200 ${
              tab === 'translation' ? 'bg-[#3F4A59] text-white shadow-md' : 'text-black/70'
            }`}
          >
            {isEng ? 'Translation' : '번역'}
          </button>
        </div>

        <p className="mb-1 text-xs font-bold text-black">
          {isEng ? 'Korea Aerospace University' : '한국항공대학교'}
        </p>
        <h2 className="mb-2 text-lg font-extrabold text-black">
          {isEng ? '52nd Student Council CHUNGWOON' : '제52대 총학생회 청운'}
        </h2>
        <p className="text-xs font-medium text-black">03.05 - 05.20</p>
      </div>

      {tab === 'dev' && <DevSection isEng={isEng} />}
      {tab === 'planning' && <PlanningSection isEng={isEng} />}
      {tab === 'translation' && <TranslationSection isEng={isEng} />}

      <div className="mt-auto flex w-full flex-col items-center gap-3">
        <p className="mb-1 text-[11px] font-bold text-black">
          {isEng
            ? 'Want to see more from the Student Council?'
            : '총학생회의 더 다양한 활동이 궁금하다면?'}
        </p>
        <a
          href="https://www.instagram.com/kau_students?igsh=MXRpNmF0MzA3MHZudA=="
          target="_blank"
          rel="noreferrer"
          className="flex w-48 items-center justify-center rounded-2xl bg-[#3F4A59] py-3 text-xs font-bold text-white shadow-lg transition-transform active:scale-95"
        >
          {isEng ? 'Visit Instagram' : '인스타그램 바로가기'}
        </a>
        <a
          href="https://www.youtube.com/@KAU_students"
          target="_blank"
          rel="noreferrer"
          className="flex w-48 items-center justify-center rounded-2xl bg-[#3F4A59] py-3 text-xs font-bold text-white shadow-lg transition-transform active:scale-95"
        >
          {isEng ? 'Visit YouTube' : '유튜브 바로가기'}
        </a>
      </div>
    </div>
  );
};

export default Makers;
