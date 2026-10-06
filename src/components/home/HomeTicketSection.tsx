import HomeBoardingPassCard from '@/components/home/HomeBoardingPassCard';

interface HomeTicketSectionProps {
  to: string;
}

const HomeTicketSection = ({ to }: HomeTicketSectionProps) => {
  return (
    <section className="relative -mt-[14px] flex h-[453px] w-full justify-center">
      <HomeBoardingPassCard bottomTo={to} topTo="/timetable" />
    </section>
  );
};

export default HomeTicketSection;
