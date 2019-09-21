// Controller types
export type TController =
  'grid' |
  'details' |
  'empty';

// Menu item interface
export interface IMenuItem {
  displayName: string;
  description: string;
  routePath: string;
  routerLink: string;
  controllerType: TController;
  controllerSource: string | null;
  children: IMenuItem[];
}
