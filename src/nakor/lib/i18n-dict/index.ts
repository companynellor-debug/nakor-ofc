export type Dict = Record<string, { en: string; es: string }>;

import { commonDict } from './common';
import { authDict } from './auth';
import { onboardingDict } from './onboarding';
import { onboarding2Dict } from './onboarding2';
import { homeDict } from './home';
import { tasksDict } from './tasks';
import { focusDict } from './focus';
import { resultDict } from './result';
import { profileDict } from './profile';
import { lojaDict } from './loja';

export const DICTIONARY: Dict = {
  ...commonDict,
  ...authDict,
  ...onboardingDict,
  ...onboarding2Dict,
  ...homeDict,
  ...tasksDict,
  ...focusDict,
  ...resultDict,
  ...profileDict,
  ...lojaDict,
};
