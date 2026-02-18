import { useStore } from '@/lib/store';
import Onboarding from '@/components/Onboarding';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  const { state } = useStore();

  return state.isOnboarded ? <Dashboard /> : <Onboarding />;
};

export default Index;
