import { NextPage } from "next";
import MarathonTraining2026 from "../components/marathon-training/MarathonTraining2026";
import SeoHead from "../components/SeoHead";

const MarathonTrainingPage: NextPage = () => {
  return (
    <section>
      <SeoHead
        title="Chicago Marathon 2026 Training"
        description="An 18-week training load chart for the 2026 Chicago Marathon, with daily mileage, weekly totals, and build/cutback/taper phases."
        canonicalPath="/marathon-training"
      />
      <MarathonTraining2026 />
    </section>
  );
};

export default MarathonTrainingPage;
