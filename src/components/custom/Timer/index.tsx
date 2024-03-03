import { useEffect, useState } from "react";
import moment, { Duration } from "moment";

type TTimerComponentProps = {
  startDate: moment.Moment;
};

export default function Timer({
  startDate,
}: TTimerComponentProps): JSX.Element {
  const [elapsedTime, setElapsedTime] = useState<number>(
    moment().diff(startDate, "milliseconds"),
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setElapsedTime(moment().diff(startDate, "milliseconds"));
    }, 1000); // Update every second

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [startDate]);

  const duration: Duration = moment.duration(elapsedTime);
  const formattedTime: string = `${duration.hours()}:${duration.minutes()}:${duration.seconds()}`;
  return (
    <div>
      <p>Time elapsed {formattedTime}</p>
    </div>
  );
}
