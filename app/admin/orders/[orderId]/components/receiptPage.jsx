'use client'

import { Button, CircularProgress } from '@nextui-org/react'
import { Download } from 'lucide-react'
import html2pdf from 'html2pdf.js'
import { formatMoney } from '@/lib/helpers'

export default function ReceiptPage({ customer, order }) {
	// Calculate subtotal and VAT
	const totalAmount = order?.payment?.amount || 0
	const subtotal = totalAmount / 1.075 // Reverse calculate subtotal
	const vat = subtotal * 0.075 // 7.5% VAT

	if (!order || !customer) {
		return (
			<div className="flex justify-center py-48">
				<CircularProgress />
			</div>
		)
	}

	// Function to generate and download the receipt
	const handleDownloadReceipt = () => {
		const receiptElement = document.getElementById('receipt')
		const options = {
			margin: 0.5,
			filename: `invoice-${order.id}.pdf`,
			image: { type: 'jpeg', quality: 0.98 },
			html2canvas: { scale: 2, useCORS: true },
			jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
		}

		// Convert the receipt element to PDF
		html2pdf().from(receiptElement).set(options).save()
	}

	return (
		<div className="flex flex-col max-w-[800px] gap-4 p-5 text-sm">
			{/* Download Button */}
			<div className="flex justify-end">
				<Button size="md" className="h-8" onPress={handleDownloadReceipt}>
					<Download size={14} /> Download Invoice
				</Button>
			</div>

			{/* Receipt Content - Optimized for PDF */}
			<div id="receipt" className="bg-white p-8 rounded-lg" style={{ fontFamily: 'Arial, sans-serif' }}>
				{/* Header with Logo and Company Info */}
				<div className="border-b-2 border-gray-800 pb-6 mb-6">
					<div className="flex justify-between items-start">
						<div>
							<img className="h-16 mb-3" src="/logo.png" alt="Logo" />
							<div className="text-xs text-gray-700 leading-relaxed max-w-xs">
								<p className="font-semibold text-gray-900">Laptop Warehouse Online</p>
								<p className="mt-1">Suite 28, 29 & 30 (Distinct Plaza)</p>
								<p>No 14 Francis Oremeji Street</p>
								<p>Opposite UBA Bank, Computer Village</p>
								<p>Ikeja, Lagos, Nigeria</p>
								<p className="mt-2">
									<strong>Email:</strong> Laptopwarehouseonline@gmail.com
								</p>
								<p>
									<strong>Phone:</strong> +234 706 630 5155
								</p>
							</div>
						</div>
						<div className="text-right">
							<h1 className="text-3xl font-bold text-gray-900 mb-2">INVOICE</h1>
							<div className="text-xs text-gray-700">
								<p className="mb-1">
									<strong>Invoice #:</strong> {order.id}
								</p>
								<p className="mb-1">
									<strong>Date:</strong> {order?.timestampCreate?.toDate()?.toLocaleDateString()}
								</p>
								<p className="mb-1">
									<strong>Payment:</strong>{' '}
									<span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-medium">
										{order.paymentMode}
									</span>
								</p>
								<p>
									<strong>Status:</strong>{' '}
									<span className="inline-block px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs font-medium">
										{order.status}
									</span>
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Bill To Section */}
				<div className="mb-6">
					<h2 className="text-sm font-bold text-gray-900 mb-3 uppercase">Bill To:</h2>
					<div className="bg-gray-50 p-4 rounded text-xs text-gray-700">
						{customer
							.filter((d) => d.value !== undefined)
							.map((d, i) => (
								<p key={i} className="mb-1">
									<strong className="text-gray-900">{d.key}:</strong> {d.value || '--'}
								</p>
							))}
					</div>
				</div>

				{/* Products Table */}
				<div className="mb-6">
					<table className="w-full text-xs">
						<thead>
							<tr className="bg-gray-800 text-white">
								<th className="text-left py-3 px-3 font-semibold">Item</th>
								<th className="text-center py-3 px-3 font-semibold">Unit Price</th>
								<th className="text-center py-3 px-3 font-semibold">Qty</th>
								<th className="text-right py-3 px-3 font-semibold">Amount</th>
							</tr>
						</thead>
						<tbody>
							{order?.checkout?.line_items?.map((item, i) => (
								<tr key={i} className="border-b border-gray-200">
									<td className="py-3 px-3">
										<div>
											<p className="font-medium text-gray-900">{item?.name}</p>
											{item?.identifierData?.identifier && (
												<p className="text-xs text-gray-500 mt-0.5">S/N: {item?.identifierData?.identifier}</p>
											)}
										</div>
									</td>
									<td className="text-center py-3 px-3 text-gray-700">{formatMoney(item?.unit_price)}</td>
									<td className="text-center py-3 px-3 text-gray-700">{item.quantity}</td>
									<td className="text-right py-3 px-3 font-medium text-gray-900">
										{formatMoney(item?.unit_price * item?.quantity)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* Totals Section */}
				<div className="flex justify-end mb-6">
					<div className="w-64">
						<div className="space-y-2 text-xs">
							<div className="flex justify-between py-2 border-b border-gray-200">
								<span className="text-gray-600">Subtotal:</span>
								<span className="font-medium text-gray-900">{formatMoney(subtotal)}</span>
							</div>
							<div className="flex justify-between py-2 border-b border-gray-200">
								<span className="text-gray-600">VAT (7.5%):</span>
								<span className="font-medium text-gray-900">{formatMoney(vat)}</span>
							</div>
							<div className="flex justify-between py-3 bg-gray-800 text-white px-3 rounded">
								<span className="font-bold text-sm">TOTAL:</span>
								<span className="font-bold text-sm">{formatMoney(totalAmount)}</span>
							</div>
						</div>
					</div>
				</div>

				{/* Footer */}
				<div className="border-t-2 border-gray-200 pt-4 mt-8">
					<div className="text-xs text-gray-600 text-center">
						<p className="font-semibold text-gray-900 mb-2">Thank you for your business!</p>
						<p>If you have any questions about this invoice, please contact us.</p>
						<p className="mt-2">
							<strong>Email:</strong> Laptopwarehouseonline@gmail.com | <strong>Phone:</strong> +234 706 630 5155
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}
