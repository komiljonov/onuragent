"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Phone } from "lucide-react";
import Link from "next/link";
import request from "@/lib/request";
import { useUser } from "@/hooks/auth";
import { Badge } from "@/components/ui/badge";

interface User {
  id: string;
  name: string;
  phone_number: string;
  balance: number;
}

interface UsersResponse {
  users: User[];
}

const fetchUsers = async (userId: number): Promise<UsersResponse> => {
  const { data } = await request.get(`/counterparties/${userId}`);
  return data;
};

const getBalanceBadgeColor = (balance: number) => {
  if (balance > 0) return "text-green-600 bg-green-100"
  if (balance < 0) return "text-red-600 bg-red-100"
  return "text-gray-600 bg-gray-100"
}

function UserCard({ user }: { user: User }) {
  const { userId } = useUser()!;
  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <Link href={`/info?userId=${userId}&id=${user.id}`}>
          <h3 className="text-lg font-semibold mb-2">{user.name}</h3>
          <p className="text-sm text-muted-foreground mb-1">ID: {user.id}</p>

          {/* <div className="flex justify-between mb-2"> */}
          <p className="text-sm">Telefon raqami: {user.phone_number}</p>
          <p className="text-sm">Balans:  <Badge variant="secondary" className={`${getBalanceBadgeColor(-user.balance)}`}>
            ${Math.abs(user.balance)}{" "}
          </Badge></p>
          {/* </div> */}

        </Link>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-[rgb(4,154,0)]"
          onClick={() => window.open(`tel:${user.phone_number}`)}
        >
          <Phone className="mr-2 h-4 w-4" /> Bog'lanish
        </Button>
      </CardFooter>
    </Card>
  );
}

function UserCardSkeleton() {
  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-1" />
        <div className="flex justify-between mb-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}

function Users() {
  const { userId } = useUser()!;
  const [search, setSearch] = useState("");

  const { data, status, isLoading } = useQuery<UsersResponse>({
    queryKey: ["users", userId],
    queryFn: () => fetchUsers(userId!),
    enabled: !!userId,
  });

  return (
    <div className="container mx-auto">
      <Input
        className="mb-4"
        placeholder="Kontragentlarni qidirish"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <UserCardSkeleton key={index} />
          ))
        ) : status === "error" ? (
          <div className="col-span-full text-center text-red-500">
            Error fetching users
          </div>
        ) : (
          <>
            {data?.users.filter((user) => { return user.name.toLowerCase().includes(search.toLowerCase()) || user.id.toLowerCase().includes(search.toLowerCase()) || user.phone_number.toLowerCase().includes(search.toLowerCase()) }).map((user) => <UserCard key={user.id} user={user} />)}
          </>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-8">
        Foydalanuvchilar ro&apos;yxati
      </h1>
      <Users />
    </div>
  );
}