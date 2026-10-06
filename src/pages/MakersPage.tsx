import RetroPageHeader from '../components/common/RetroPageHeader';
import cheongunLogoLarge from '../assets/cheongun_logo_large.svg';
import { useLanguage } from '../contexts/LanguageContext';

interface Member {
  name: string;
  dept: string;
  dept_en: string;
}

interface MemberSection {
  title: string;
  title_en: string;
  members: Member[];
}

const SECTIONS: MemberSection[] = [
  {
    title: '전체 총괄',
    title_en: 'Director',
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

  return (
    <div className="flex flex-col px-5 pb-16 pt-5 text-ink">
      <RetroPageHeader title={isEng ? 'Makers' : '만든이'} />

      <section className="mt-6 flex flex-col items-center rounded-[16px] border-2 border-ink bg-paper px-5 py-8 text-center drop-shadow-[6px_6px_0px_var(--color-ink)]">
        <img src={cheongunLogoLarge} alt="청운" width={160} height={108} />
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
        <p className="pt-3 font-typewriter text-[16px] font-bold leading-6 tracking-[1.6px] text-rust">
          03.05 - 04.28
        </p>
      </section>

      <div className="flex flex-col gap-7 pt-8">
        {SECTIONS.map((section) => (
          <section key={section.title} className="flex flex-col items-center">
            <span className="rounded-full border border-ink bg-ink px-5 py-1 font-body-kr text-[15px] font-semibold leading-[22.5px] text-paper drop-shadow-[3px_3px_0px_var(--color-mustard)]">
              {isEng ? section.title_en : section.title}
            </span>
            <ul className="grid w-full max-w-[320px] grid-cols-2 gap-x-6 gap-y-4 pt-4 text-center font-body-kr">
              {section.members.map((member) => (
                <li key={`${section.title}-${member.name}`} className="flex flex-col">
                  <span className="text-[11px] font-semibold leading-[16.5px]">
                    {isEng ? member.dept_en : member.dept}
                  </span>
                  <span className="text-[13px] font-extrabold leading-[19.5px]">{member.name}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
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
              className="rounded-full border border-ink bg-ink py-[10px] text-center font-body-kr text-[13px] font-semibold leading-[19.5px] text-paper drop-shadow-[3px_3px_0px_var(--color-rust)]"
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
