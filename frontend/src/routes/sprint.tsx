import Dashboard from '@/pages/sprint/Dashboard'
import Projects from '@/pages/sprint/Projects'
import Team from '@/pages/sprint/Team'
import SprintGenerator from '@/pages/sprint/SprintGenerator'
import ProjectDetails from '@/pages/sprint/ProjectDetails'
import Settings from '@/pages/sprint/Settings'

export const sprintRoutes = [
  {
    path: '/sprint',
    element: <Dashboard />,
  },
  {
    path: '/sprint/projects',
    element: <Projects />,
  },
  {
    path: '/sprint/projects/:id',
    element: <ProjectDetails />,
  },
  {
    path: '/sprint/team',
    element: <Team />,
  },
  {
    path: '/sprint/generator',
    element: <SprintGenerator />,
  },
  {
    path: '/sprint/settings',
    element: <Settings />,
  },
]
