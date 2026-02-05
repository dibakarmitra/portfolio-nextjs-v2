/**
 * Navigation UI Types
 * Navigation menu and routing related types
 */

/**
 * Navigation menu item
 */
export interface NavItem {
    label: string;
    id: string;
    icon: React.ComponentType<any>;
    href?: string;
}
