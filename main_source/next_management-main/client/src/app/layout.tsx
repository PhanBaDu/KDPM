import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import DashboardWrapper from '@/app/dashboardWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Nhóm 2',
    description: 'Bài tập nhóm 2',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <DashboardWrapper>{children}</DashboardWrapper>
            </body>
        </html>
    );
}
