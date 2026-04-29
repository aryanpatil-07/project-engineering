// src/components/OrdersDashboard.jsx
import { useState, useEffect, useMemo } from 'react'
import { fetchOrders } from '../mockApi'

// ----------------------
// Small UI primitives
// ----------------------
function SkeletonRow() {
  return (
    <tr>
      {[40, 130, 180, 90, 120, 90].map((w, i) => (
        <td key={i} style={{ padding: '16px 20px' }}>
          <div style={{
            width: w, height: 13, borderRadius: 6,
            background: 'linear-gradient(90deg, var(--surface-2) 25%, var(--border) 50%, var(--surface-2) 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.4s infinite',
          }} />
        </td>
      ))}
    </tr>
  )
}

function OrderRow({ order }) {
  const STATUS_CONFIG = {
    Delivered:  { color: '#10b981', bg: 'rgba(16,185,129,0.12)',  dot: '#10b981' },
    Shipped:    { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)',  dot: '#3b82f6' },
    Processing: { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', dot: '#f59e0b' },
    Pending:    { color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)', dot: '#8b5cf6' },
    Cancelled:  { color: '#ef4444', bg: 'rgba(239,68,68,0.12)',  dot: '#ef4444' },
  }
  const s = STATUS_CONFIG[order.status] || STATUS_CONFIG.Pending

  // Priority flag: business rule — orders with high value or pending status show a priority flag
  const isPriority = order.amount >= 30000 || order.status === 'Pending' || order.items > 3

  return (
    <tr style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.15s' }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
      <td style={{ padding: '15px 20px', fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--accent)', fontWeight: 500 }}>
        <span title={isPriority ? 'Priority order' : ''} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span>{order.id}</span>
          {isPriority && <span style={{ color: '#ff6b6b', fontSize: 14 }}>🔥</span>}
        </span>
      </td>
      <td style={{ padding: '15px 20px', color: 'var(--text-primary)', fontWeight: 500 }}>{order.customer}</td>
      <td style={{ padding: '15px 20px', color: 'var(--text-secondary)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{order.product}</td>
      <td style={{ padding: '15px 20px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--mono)', fontSize: 13 }}>₹{order.amount.toLocaleString()}</td>
      <td style={{ padding: '15px 20px' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: s.bg, color: s.color, padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot }} />
          {order.status}
        </span>
      </td>
      <td style={{ padding: '15px 20px', color: 'var(--text-muted)', fontSize: 13 }}>{order.date}</td>
    </tr>
  )
}

// ----------------------
// UX State Components
// ----------------------
function LoadingState() {
  // show 6 skeleton rows to mirror real layout
  return (
    <tr>
      <td colSpan={6} style={{ padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}
          </tbody>
        </table>
      </td>
    </tr>
  )
}

function EmptyState({ onRefresh, filterActive = false }) {
  return (
    <tr>
      <td colSpan={6}>
        <div style={{ padding: '60px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center' }}>
          <div style={{ fontSize: 48 }}>📭</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>
            {filterActive ? 'No orders match your filters' : 'No orders yet'}
          </div>
          <div style={{ color: 'var(--text-secondary)', maxWidth: 420, lineHeight: 1.6 }}>
            {filterActive
              ? 'Try clearing filters or broaden your search to find more orders.'
              : 'There are no orders in the system yet. Use the "Refresh" button or create an order to get started.'}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button onClick={onRefresh} style={{
              padding: '8px 18px', background: 'var(--accent)', border: 'none', borderRadius: 'var(--radius)', color: '#000', fontWeight: 600, cursor: 'pointer'
            }}>Refresh</button>
            <button onClick={onRefresh} style={{
              padding: '8px 18px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--text-primary)', cursor: 'pointer'
            }}>{filterActive ? 'Clear filters' : 'Create order'}</button>
          </div>
        </div>
      </td>
    </tr>
  )
}

function ErrorState({ message, onRetry }) {
  // Map error to actionable message
  const lower = (message || '').toLowerCase()
  let title = 'Failed to load orders'
  let details = message || 'An unknown error occurred.'

  if (lower.includes('503')) {
    title = 'Service unavailable'
    details = 'The orders service is temporarily unavailable (503). Try again in a few moments.'
  } else if (lower.includes('network') || lower.includes('failed to fetch')) {
    title = 'Network error'
    details = 'We could not reach the server. Check your connection and try again.'
  } else if (lower.includes('timeout')) {
    title = 'Request timed out'
    details = 'The request took too long. Try refreshing.'
  }

  return (
    <tr>
      <td colSpan={6}>
        <div style={{ padding: '60px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center' }}>
          <div style={{ fontSize: 48 }}>⚠️</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>{title}</div>
          <div style={{ color: 'var(--text-secondary)', maxWidth: 520, lineHeight: 1.6, fontFamily: 'var(--mono)' }}>{details}</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button onClick={onRetry} style={{
              padding: '8px 18px', background: 'var(--accent)', border: 'none', borderRadius: 'var(--radius)', color: '#000', fontWeight: 600, cursor: 'pointer'
            }}>Retry</button>
            <button onClick={onRetry} style={{
              padding: '8px 18px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--text-primary)', cursor: 'pointer'
            }}>Report issue</button>
          </div>
        </div>
      </td>
    </tr>
  )
}

// ----------------------
// Main Dashboard
// ----------------------
export default function OrdersDashboard() {
  const [orders,  setOrders]  = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const [filterActive] = useState(false) // placeholder — if filters are added later, wire this up

  const loadOrders = () => {
    setLoading(true)
    setError(null)
    setOrders([])

    fetchOrders()
      .then(data => {
        setOrders(data || [])
        setLoading(false)
      })
      .catch(err => {
        setError(err && err.message ? err.message : String(err))
        setLoading(false)
      })
  }

  useEffect(() => {
    loadOrders()
  }, [])

  // Derived stats
  const totalRevenue = useMemo(() => orders.reduce((s, o) => s + (o.status !== 'Cancelled' ? o.amount : 0), 0), [orders])
  const statusCounts = useMemo(() => orders.reduce((acc, o) => {
    acc.total += 1
    acc[o.status] = (acc[o.status] || 0) + 1
    return acc
  }, { total: 0 }), [orders])

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 32px' }}>

      {/* PAGE HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ width: 38, height: 38, background: 'var(--accent)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>📦</div>
            <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.5px', color: 'var(--text-primary)' }}>Orders</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Manage and track all customer orders in one place.</p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ textAlign: 'right', color: 'var(--text-secondary)', fontSize: 13 }}>
            <div style={{ fontFamily: 'var(--mono)', fontWeight: 700 }}>{loading ? '—' : `${statusCounts.total || 0} orders`}</div>
            <div style={{ fontSize: 12 }}>{loading ? '' : `₹${totalRevenue.toLocaleString()} total value`}</div>
          </div>
          <button onClick={loadOrders} style={{
            padding: '10px 20px', background: 'var(--accent)', color: '#000',
            border: 'none', borderRadius: 'var(--radius)', fontSize: 14,
            fontWeight: 600, cursor: 'pointer',
          }}>
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* STAT CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
        {[
          { label: 'Total Revenue',    value: loading ? '—' : `₹${totalRevenue.toLocaleString()}`, icon: '💰', color: 'var(--accent)'  },
          { label: 'Delivered',        value: loading ? '—' : (statusCounts.Delivered || 0), icon: '✅', color: 'var(--green)'  },
          { label: 'Needs Attention',  value: loading ? '—' : ((statusCounts.Pending || 0) + (statusCounts.Processing || 0)), icon: '⏳', color: 'var(--purple)' },
        ].map((card, i) => (
          <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px 22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{card.label}</span>
              <span style={{ fontSize: 18 }}>{card.icon}</span>
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, color: card.color, fontFamily: 'var(--mono)' }}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* ORDERS TABLE */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>
            Recent Orders
            {!loading && !error && (
              <span style={{ marginLeft: 10, fontSize: 13, color: 'var(--text-muted)', fontWeight: 400 }}>
                {orders.length} {orders.length === 1 ? 'order' : 'orders'}
              </span>
            )}
          </h2>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Order ID', 'Customer', 'Product', 'Amount', 'Status', 'Date'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 20px', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody style={{ transition: 'opacity 240ms ease', opacity: loading ? 0.6 : 1 }}>

              {/* Conditional rendering for the 4 UX states */}
              {loading && <LoadingState />}

              {!loading && error && <ErrorState message={error} onRetry={loadOrders} />}

              {!loading && !error && orders.length === 0 && (
                <EmptyState onRefresh={loadOrders} filterActive={filterActive} />
              )}

              {!loading && !error && orders.length > 0 && (
                <>
                  {orders.map(o => <OrderRow key={o.id} order={o} />)}
                </>
              )}

            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0 }
          100% { background-position:  200% 0 }
        }
      `}</style>
    </div>
  )
}