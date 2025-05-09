'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { FaceIcon } from "@radix-ui/react-icons"
import classnames from "classnames";
import { useSession } from "next-auth/react";
import { Avatar, Box, Button, Container, DropdownMenu, Flex, Text } from "@radix-ui/themes";
import Skeleton from "react-loading-skeleton";

const NavBar = () => {
    return (
        <nav className="border-b mb-5 px-5 py-3">
        <Container>
          <Flex justify="between">
            <Flex align="center" gap="3">
              <Link href="/">
                <FaceIcon />
              </Link>
              <NavLinks />
           </Flex>
           <AuthStatus />
         </Flex>
       </Container>
        </nav>
    )
}

const NavLinks = () => {
    const currentPath = usePathname();
        
    const links = [
        {label: 'Dashboard', href:'/'},
        {label: 'Issues', href:'/issues'}
    ]

    return (
        <ul className="flex space-x-6">
            {links.map((link) => (
                <li key={link.href}>
                    <Link
                    className={classnames({
                        "nav-link": true, 
                        "!text-zinc-900": link.href === currentPath,
                    })}
                    href={link.href}
                    >
                    {link.label}
                    </Link>
                </li>
            ))}
        </ul>
    )
}

const AuthStatus = () => {
    const {status, data: session} = useSession();

    if (status === "loading") return <Skeleton width="3rem"/>;

    if (status === "unauthenticated")
        return <Link className="nav-link" href="/api/auth/signin">Login</Link>

    return (
        <Box>
            <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                    <Button variant="ghost" size="1" radius="full">
                        <Avatar
                            src={session!.user?.image ?? undefined}
                            fallback="?"
                            className="cursor-pointer"
                            referrerPolicy="no-referrer"
                        />
                    </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                    <DropdownMenu.Label>
                        <Text size="2">
                            {session!.user!.email}
                        </Text>
                    </DropdownMenu.Label>
                    <DropdownMenu.Item >
                        <Link href="/api/auth/signout">Log out</Link>
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Root>
        </Box>
    )
}
export default NavBar