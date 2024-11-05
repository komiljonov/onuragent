'use client'

import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/router"
import { useQuery } from "@tanstack/react-query"
import request from "@/lib/request"
import { Skeleton } from "@/components/ui/skeleton"
// import { Card } from "@/components/ui/card"
// import IOrder from "@/lib/types/order"
import OrderDisplay from "@/components/orders"
import useTelegramBackButton from "@/hooks/back"


interface IUser {
  id: string
  name: string
  phone_number: string
  balance: number
}

function toBase64(str: string) {
  const bytes = new TextEncoder().encode(str)
  let binaryString = ''
  bytes.forEach((byte) => {
    binaryString += String.fromCharCode(byte)
  })
  return btoa(binaryString)
}

// const fetchOrders = async (counterPartyId: string): Promise<IOrder[]> => {
//   const { data } = await request.get(`get_orders_for_counterparty/${toBase64(counterPartyId)}`)
//   return data.orders
// }

const fetchCounterParty = async (counterPartyId: string): Promise<IUser> => {
  const { data } = await request.get(`counterparty/${toBase64(counterPartyId)}`)
  return data
}

export function UserInfoSkeleton() {
  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div>
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div>
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-6 w-24" />
          </div>
        </div>
      </div>

      {/* <Tabs defaultValue="orders" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>
        <TabsContent value="orders">
          <Skeleton className="h-8 w-40 mb-4" />
          <Card>
            <div className="p-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex justify-between items-center py-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="payments">
          <Skeleton className="h-8 w-40 mb-4" />
          <Card>
            <div className="p-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex justify-between items-center py-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs> */}
    </div>
  )
}

function UserInfoPage() {
  const { query: { id } } = useRouter();



  // const { data: orders, isLoading: isLoadingOrders } = useQuery({
  //   queryKey: ['orders', id],
  //   queryFn: () => fetchOrders(id as string),
  //   enabled: !!id
  // })

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ['user', id],
    queryFn: () => fetchCounterParty(id as string),
    enabled: !!id
  })

  if (isLoadingUser || !user) {
    return <UserInfoSkeleton />
  }

  const getBalanceBadgeColor = (balance: number) => {
    if (balance > 0) return "text-green-600 bg-green-100"
    if (balance < 0) return "text-red-600 bg-red-100"
    return "text-gray-600 bg-gray-100"
  }

  return (
    <div className="container mx-auto p-2 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="user-id">ID</Label>
            <Input id="user-id" value={user.id} readOnly />
          </div>
          <div>
            <Label htmlFor="user-name">ismi</Label>
            <Input id="user-name" value={user.name} readOnly />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <Label htmlFor="user-phone">Telefon raqami</Label>
            <Input id="user-phone" value={user.phone_number} readOnly />
          </div>
          <div>
            <Label htmlFor="user-balance">Balance</Label>
            <div className="mt-1">
              <Badge variant="secondary" className={`text-sm px-2 py-1 ${getBalanceBadgeColor(-user.balance)}`}>
                ${Math.abs(user.balance)}{" "}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* <Tabs defaultValue="orders" className="space-y-4"> */}
      {/* <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList> */}
      {/* <TabsContent value="orders"> */}
      <h2 className="text-xl sm:text-2xl font-semibold m1-4">
        Buyurtmalar tarixi
      </h2>
      <OrderDisplay counterPartyId={user.id} />
      {/* <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.id}</TableCell>
                <TableCell>${order.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div> */}
      {/* </TabsContent> */}
      {/* <TabsContent value="payments">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">
            Payments History
          </h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Payment ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.id}</TableCell>
                    <TableCell>{payment.date}</TableCell>
                    <TableCell>${payment.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent> */}
      {/* </Tabs> */}
    </div>
  )
}

export default function Page() {
  useTelegramBackButton();

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Foydalanuvchi malumotlari</h1>
      <UserInfoPage />
    </div>
  )
}