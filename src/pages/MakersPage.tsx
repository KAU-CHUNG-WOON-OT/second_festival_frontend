import { useState } from 'react';
import RetroPageHeader from '../components/common/RetroPageHeader';
import cheongunLogoLarge from '../assets/cheongun_logo_large.svg';
import { useLanguage } from '../contexts/LanguageContext';

interface Member {
  name: string;
  dept: string;
  dept_en: string;
  // 운영진만: 이름 위에 직책
  role?: string;
  role_en?: string;
  // 두 칸을 다 써서 가운데에
  wide?: boolean;
}

interface MemberSection {
  title: string;
  title_en: string;
  members: Member[];
}

const SECTIONS: MemberSection[] = [
  {
    title: '전체 총괄',
    title_en: 'Project Leads',
    members: [
      { name: '홍석담', dept: '경영학부 22', dept_en: "Business '22" },
      { name: '주민재', dept: '소프트웨어 24', dept_en: "Software '24" },
    ],
  },
  {
    title: 'PM/Design',
    title_en: 'PM/Design',
    members: [
      { name: '주민재', dept: '소프트웨어 24', dept_en: "Software '24" },
      { name: '윤정민', dept: '소프트웨어 23', dept_en: "Software '23" },
    ],
  },
  {
    title: 'Developer',
    title_en: 'Developer',
    members: [
      { name: '이상원', dept: '소프트웨어 21', dept_en: "Software '21" },
      { name: '서준익', dept: '소프트웨어 21', dept_en: "Software '21" },
      { name: '윤정민', dept: '소프트웨어 23', dept_en: "Software '23" },
      { name: '신영섭', dept: '소프트웨어 21', dept_en: "Software '21" },
    ],
  },
];

// 총학생회 운영진 (1학기 축제 만든이 페이지의 '축제기획' 탭 기준)
const STAFF_SECTIONS: MemberSection[] = [
  {
    title: 'Executive',
    title_en: 'Executive',
    members: [
      { role: '총학생회장', role_en: 'President', name: '홍석담', dept: '경영 22', dept_en: "Business '22" },
      { role: '부총학생회장', role_en: 'Vice President', name: '주민재', dept: '소프트 24', dept_en: "Software '24" },
      { role: '사업전략실장', role_en: 'Head of Business Strategy', name: '김민겸', dept: '물류 22', dept_en: "Logistics '22", wide: true },
    ],
  },
  {
    title: 'Director',
    title_en: 'Director',
    members: [
      { role: '정책국장', role_en: 'Policy Director', name: '이나라', dept: '경영 21', dept_en: "Business '21" },
      { role: '협력국장', role_en: 'Partnerships Director', name: '장현진', dept: '항우기 20', dept_en: '항우기 20' },
      { role: '기획국장', role_en: 'Planning Director', name: '이승주', dept: '소프트웨어 23', dept_en: "Software '23" },
      { role: '문화국장', role_en: 'Culture Director', name: '최성훈', dept: '교통 23', dept_en: '교통 23' },
      { role: '홍보국장', role_en: 'Promotion Director', name: '최길웅', dept: '자율주행 22', dept_en: '자율주행 22', wide: true },
    ],
  },
  {
    title: 'Office',
    title_en: 'Office',
    members: [
      { role: '집행위원장', role_en: 'Executive Chair', name: '김가빈', dept: '경영 23', dept_en: "Business '23" },
      { role: '예산실장', role_en: 'Head of Budget', name: '강미주', dept: '자율주행 24', dept_en: '자율주행 24' },
      { role: '공보실장', role_en: 'Head of PR', name: '윤여범', dept: '교통 22', dept_en: '교통 22' },
      { role: '개발실장', role_en: 'Head of Development', name: '윤정민', dept: '소프트 23', dept_en: "Software '23" },
    ],
  },
];

// 위쪽 버튼으로 바꿔 보는 명단 (버튼은 개발자가 앞, 처음 보이는 건 운영진)
const TABS = [
  { label: '개발자', label_en: 'Developers', sections: SECTIONS },
  { label: '운영진', label_en: 'Staff', sections: STAFF_SECTIONS },
];
const FIRST_TAB = 1;

const LINKS = [
  {
    label: '인스타그램 바로가기',
    label_en: 'Visit Instagram',
    href: 'https://www.instagram.com/kau_students?igsh=MXRpNmF0MzA3MHZudA==',
  },
  { label: '유튜브 바로가기', label_en: 'Visit YouTube', href: 'https://www.youtube.com/@KAU_students' },
];

const Makers = () => {
  const { language } = useLanguage();
  const isEng = language === 'ENG';
  const [tabIndex, setTabIndex] = useState(FIRST_TAB);
  const tabLabels = TABS.map((tab) => (isEng ? tab.label_en : tab.label));

  const sectionList = (sections: MemberSection[]) =>
    sections.map((section) => (
      <section key={section.title} className="flex flex-col items-center">
        <span className="rounded-full border border-ink bg-ink px-5 py-1 font-body-kr text-[15px] font-semibold leading-[22.5px] text-paper shadow-[3px_3px_0px_0px_var(--color-mustard)]">
          {isEng ? section.title_en : section.title}
        </span>
        <ul className="grid w-full max-w-[320px] grid-cols-2 gap-x-6 gap-y-4 pt-4 text-center font-body-kr">
          {section.members.map((member) => (
            <li
              key={`${section.title}-${member.name}`}
              className={`flex flex-col ${member.wide ? 'col-span-2' : ''}`}
            >
              {member.role ? (
                <>
                  <span className="text-[11px] font-semibold leading-[16.5px]">
                    {isEng ? member.role_en : member.role}
                  </span>
                  <span className="text-[13px] font-extrabold leading-[19.5px]">{member.name}</span>
                  <span className="text-[11px] leading-[16.5px] opacity-60">
                    {isEng ? member.dept_en : member.dept}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-[11px] font-semibold leading-[16.5px]">
                    {isEng ? member.dept_en : member.dept}
                  </span>
                  <span className="text-[13px] font-extrabold leading-[19.5px]">{member.name}</span>
                </>
              )}
            </li>
          ))}
        </ul>
      </section>
    ));

  return (
    <div className="flex flex-col px-5 pb-16 pt-5 text-ink">
      <RetroPageHeader title={isEng ? 'Makers' : '만든이'} showMenu />

      {/* 박스 없이 노을 배경 위에 바로: 로고·글자는 밝게 */}
      <section className="mt-6 flex flex-col items-center text-center text-paper">
        <img src={cheongunLogoLarge} alt="청운" width={160} height={108} className="brightness-0 invert" />
        <h2 className="pt-5 font-display text-[24px] leading-[33px]">
          {isEng ? (
            'Korea Aerospace University 52nd Student Council CHUNGWOON'
          ) : (
            <>
              한국항공대학교
              <br />
              제52대 총학생회 청운
            </>
          )}
        </h2>
        <p className="pt-3 font-typewriter text-[16px] font-bold leading-6 tracking-[1.6px] text-mustard">
          2026.10.28
        </p>
      </section>

      {/* 한/영 버튼(LanguageToggle)과 같은 모양 */}
      <div className="mt-8 flex justify-center">
        <div className="flex rounded-full border border-paper/80 bg-ink/40 p-[2px] backdrop-blur-[8px]">
          {tabLabels.map((label, i) => (
            <button
              key={label}
              type="button"
              // 어느 쪽을 눌러도 다른 명단으로 바뀐다 (한/영 버튼과 같이)
              onClick={() => setTabIndex((tabIndex + 1) % TABS.length)}
              aria-pressed={tabIndex === i}
              className={`rounded-full px-3 py-[6px] text-[12px] font-bold leading-4 ${
                isEng ? 'font-typewriter' : 'font-body-kr'
              } ${tabIndex === i ? 'bg-mustard text-ink' : 'text-paper'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-7 rounded-[16px] border-2 border-ink bg-paper px-5 py-7 shadow-[5px_5px_0px_0px_var(--color-ink)]">
        {sectionList(TABS[tabIndex].sections)}
      </div>

      <section className="mt-10 flex flex-col items-center border-t border-dashed border-ink/40 pt-8">
        <p className="font-body-kr text-[16px] leading-6">
          {isEng ? 'Want to see more from the Student Council?' : '총학생회의 더 다양한 활동이 궁금하다면?'}
        </p>
        <div className="flex w-[220px] flex-col gap-3 pt-4">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-ink bg-ink py-[10px] text-center font-body-kr text-[13px] font-semibold leading-[19.5px] text-paper shadow-[3px_3px_0px_0px_var(--color-rust)]"
            >
              {isEng ? link.label_en : link.label}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Makers;
