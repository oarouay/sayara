"use client"

import React, { useState } from 'react'

type Ticket = {
  id: string
  user: string
  subject: string
  message: string
  replies: { from: 'user' | 'admin', text: string, at: string }[]
  status: 'open' | 'closed'
}

export default function AdminSupportTab() {
  const [tickets, setTickets] = useState<Ticket[]>([
    { id: 't1', user: 'John Doe', subject: 'Wrong charge', message: 'I was charged twice', replies: [], status: 'open' },
    { id: 't2', user: 'Jane Smith', subject: 'Refund request', message: 'Please process my refund', replies: [], status: 'open' },
  ])

  const [replyText, setReplyText] = useState('')
  const [activeId, setActiveId] = useState<string | null>(null)

  const sendReply = (id: string) => {
    if (!replyText) return
    setTickets(prev => prev.map(t => t.id === id ? { ...t, replies: [...t.replies, { from: 'admin', text: replyText, at: new Date().toISOString() }], status: 'open' } : t))
    setReplyText('')
  }

  const closeTicket = (id: string) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'closed' } : t))
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold text-gray-900">Customer Support</h3>
        <div className="flex gap-2">
          <p className="text-sm text-gray-500">Respond to customer tickets and track status</p>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-auto">
            <ul className="divide-y">
              {tickets.map(t => (
                <li key={t.id} className={`p-3 cursor-pointer hover:bg-green-50 ${activeId === t.id ? 'bg-green-50' : 'bg-white'}`} onClick={() => setActiveId(t.id)}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-800">{t.subject}</p>
                      <p className="text-xs text-gray-500">{t.user}</p>
                    </div>
                    <div className={`text-sm font-medium ${t.status === 'open' ? 'text-green-600' : 'text-gray-500'}`}>{t.status}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="md:col-span-2">
          {activeId ? (
            (() => {
              const t = tickets.find(x => x.id === activeId)!
              return (
                <div className="bg-white border border-gray-200 rounded-lg shadow-md">
                  <div className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white p-4 rounded-t-lg">
                    <h4 className="font-semibold text-lg">{t.subject}</h4>
                    <p className="text-sm text-green-100">From: {t.user}</p>
                  </div>
                  <div className="p-6">
                    <div className="bg-green-50 p-4 rounded mb-4 border border-green-100">
                      <p className="text-gray-900">{t.message}</p>
                    </div>

                    {t.replies.length > 0 && (
                      <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                        {t.replies.map((r, i) => (
                          <div key={i} className={`p-4 rounded ${r.from === 'admin' ? 'bg-white border-l-4 border-green-500' : 'bg-white border border-gray-200'}`}>
                            <p className="text-sm text-gray-900">{r.text}</p>
                            <p className="text-xs text-gray-500 mt-1">{new Date(r.at).toLocaleString()}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Write a reply..." className="w-full p-3 border border-gray-300 rounded mb-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-200" rows={3} />
                    <div className="flex gap-3">
                      <button onClick={() => sendReply(t.id)} className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-md shadow">Send Reply</button>
                      <button onClick={() => closeTicket(t.id)} className="px-4 py-2 bg-gray-100 rounded-md">Close Ticket</button>
                    </div>
                  </div>
                </div>
              )
            })()
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
              <p className="text-gray-500">Select a ticket to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}