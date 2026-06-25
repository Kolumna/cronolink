import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { OnboardingModal } from "@/features/OnboardingModal";

type OnboardingModalContextValue = {
  isOpen: boolean;
  closeModal: () => void;
};

const OnboardingModalContext = createContext<OnboardingModalContextValue | null>(null);

export function OnboardingModalProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  console.log(user)
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsOpen(false);
      return;
    }

    const needsOnboarding = user.mustChangePassword || !user.isProfileComplete;
    setIsOpen(needsOnboarding);
  }, [user]);

  const closeModal = () => setIsOpen(false);

  return (
    <OnboardingModalContext.Provider value={{ isOpen, closeModal }}>
      {children}
      <OnboardingModal open={isOpen} />
    </OnboardingModalContext.Provider>
  );
}

export function useOnboardingModal() {
  const ctx = useContext(OnboardingModalContext);
  if (!ctx) {
    throw new Error("useOnboardingModal musi być użyty wewnątrz OnboardingModalProvider");
  }
  return ctx;
}