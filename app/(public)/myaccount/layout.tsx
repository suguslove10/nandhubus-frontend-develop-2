import MyAccount from './myaccount';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <MyAccount>{children}</MyAccount>;
}
