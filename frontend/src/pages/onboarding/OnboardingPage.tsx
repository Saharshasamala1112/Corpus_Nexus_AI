import ProgressCard from "./components/ProgressCard";
import TaskCard from "./components/TaskCard";
import { onboardingTasks } from "./data/onboardingTasks";
import { getProgress } from "./utils/taskStorage";
import "./OnboardingPage.css";

function Tasks() {
  const progress = getProgress();

  const completedCount = onboardingTasks.filter(
    (task) => progress[task.id]?.completed
  ).length;

  return (
    <div className="onboarding-page">
      <h1>Intern Onboarding</h1>

      <ProgressCard
        totalTasks={onboardingTasks.length}
        completedTasks={completedCount}
      />

      <div className="task-list">
        {onboardingTasks.map((task) => {
          const isCompleted = progress[task.id]?.completed ?? false;

          return (
            <TaskCard
              key={task.id}
              id={task.id}
              title={task.title}
              status={isCompleted ? "Completed" : "Pending"}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Tasks;