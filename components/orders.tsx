'use client'

import { useState } from 'react'
import { useMutation, useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/date-picker"
import { Download, X } from "lucide-react"
import IOrder from "@/lib/types/order"
import request from "@/lib/request"
import { parseDateString } from '@/lib/utils'
import { useUser } from '@/hooks/auth'
import { Skeleton } from './ui/skeleton'

function toBase64(str: string) {
    const bytes = new TextEncoder().encode(str)
    let binaryString = ''
    bytes.forEach((byte) => {
        binaryString += String.fromCharCode(byte)
    })
    return btoa(binaryString)
}

const fetchOrders = async (counterPartyId: string): Promise<IOrder[]> => {
    const { data } = await request.get(`get_orders_for_counterparty/${toBase64(counterPartyId)}`)
    return data.orders
}



const downloadReportPdf = async ({ counterPartyId, orderId, userId }: { counterPartyId: string, orderId: string, userId: number }) => {


    console.log(userId);



    const { data } = await request.get(`send_report_pdf/${counterPartyId}/${orderId}?userId=${userId}`);

    return data;
}


export default function OrderDisplay({ counterPartyId }: { counterPartyId: string }) {

    const { userId } = useUser()!;

    const [idFilter, setIdFilter] = useState('')
    const [startDate, setStartDate] = useState<Date | undefined>()
    const [endDate, setEndDate] = useState<Date | undefined>()

    const { data: orders, isLoading } = useQuery({
        queryKey: ['orders', counterPartyId],
        queryFn: () => fetchOrders(counterPartyId),
        enabled: !!counterPartyId
    });


    const { mutate: download } = useMutation({
        mutationFn: downloadReportPdf
    })

    const filteredOrders = orders?.filter(order => {
        const matchesId = order.id.toLowerCase().includes(idFilter.toLowerCase())
        const orderDate = parseDateString(order.created_at)
        const matchesDateRange = (!startDate || orderDate >= startDate) && (!endDate || orderDate <= endDate)
        return matchesId && matchesDateRange
    })

    const handleDownload = (order: IOrder) => {
        download({
            counterPartyId: toBase64(counterPartyId),
            orderId: toBase64(order.id),
            userId: userId!
        });
        // const csv = generateOrderCSV(order)
        // const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        // const url = URL.createObjectURL(blob)
        // const link = document.createElement('a')
        // link.href = url
        // link.setAttribute('download', `order_${order.id}.csv`)
        // document.body.appendChild(link)
        // link.click()
        // document.body.removeChild(link)
    }

    const clearFilters = () => {
        setIdFilter('')
        setStartDate(undefined)
        setEndDate(undefined)
    }
    const [filterByPeriod, setFilterByPeriod] = useState<boolean>(false)
    if (isLoading) return <div>
        {/* <Tabs defaultValue="orders" className="space-y-4"> */}
        {/* <TabsContent value="orders"> */}
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
        {/* </TabsContent> */}
        {/* <TabsContent value="payments"> */}
          {/* <Skeleton className="h-8 w-40 mb-4" />
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
          </Card> */}
        {/* </TabsContent> */}
      {/* </Tabs> */}
    </div>

    return (
        <div className="container mx-auto space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 relative">
                <div>
                    <Label htmlFor="id-filter">ID bo'yicha</Label>
                    <div className='flex gap-1'>
                        <Input
                            id="id-filter"
                            value={idFilter}
                            onChange={(e) => setIdFilter(e.target.value)}
                            placeholder="Buyurtma raqamini kiriting"
                        />
                        <Button onClick={()=>setFilterByPeriod(!filterByPeriod)}>Filter</Button>
                    </div>
                </div>
                {filterByPeriod && <div className='bg-white w-full border p-3 rounded-md shadow-md'>
                    <div>
                        <Label>Dan</Label>
                        <DatePicker date={startDate} setDate={setStartDate} />
                    </div>
                    <div>
                        <Label>Gacha</Label>
                        <DatePicker date={endDate} setDate={setEndDate} />
                    </div>
                </div>}
            </div>

            {(startDate || endDate || idFilter) && <div className="flex justify-end">
                <Button onClick={clearFilters} variant="outline" className="flex items-center">
                    <X className="w-4 h-4 mr-2" />
                    Tozalash
                </Button>
            </div>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOrders?.length ? filteredOrders?.map((order) => (
                    <Card key={order.id} className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>Buyurtma {order.id}</span>
                                <Badge variant="secondary">${order.price}</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-sm text-gray-500 mb-2">
                                Qo'shildi: {order.created_at}
                            </p>
                            <p className="text-sm text-gray-500 mb-4">
                                Yetkazib berish: {order.shipment_date}
                            </p>
                            <p className="text-sm text-gray-500 mb-4">
                                Holati: {order.status}
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Button
                                onClick={() => handleDownload(order)}
                                className="w-full"
                                aria-label={`Download order ${order.id} details`}
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Hujjatni olish
                            </Button>
                        </CardFooter>
                    </Card>
                )) : <span>Hech qanday buyurtma topilmadi!</span>}
            </div>
        </div>
    )
}