import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Plus, Pencil, Trash2, Key, X, Check, AlertTriangle, RotateCcw, ShoppingBag, Users, Package, UserCheck, UserX } from 'lucide-react'
import { getUsers, saveUsers, resetUsers, type AdminUser, type UserRole, type UserStatus } from '../data/users'
import { getCustomers, saveCustomers, resetCustomers, type Customer } from '../data/customers'
import { resetFullProducts } from '../data/fullProducts'
import { resetOrders } from '../data/orders'
import { resetNotifications } from '../data/notifications'
import { useNotifications } from '../lib/notificationsContext'
import SelectField from '../components/SelectField'

// ── Toast ────────────────────────────────────────────────────

function Toast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3000)
    return () => clearTimeout(t)
  }, [onDismiss])

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-coal text-white rounded-2xl px-5 py-3 shadow-xl text-[13px] font-semibold animate-in slide-in-from-bottom-2">
      <Check size={15} className="text-green-400 flex-shrink-0" />
      {message}
    </div>
  )
}

// ── Avatar ────────────────────────────────────────────────────

function Avatar({ user, size = 'sm' }: { user: AdminUser; size?: 'sm' | 'lg' }) {
  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
  const dim = size === 'lg' ? 'w-16 h-16 text-xl' : 'w-9 h-9 text-[13px]'
  return (
    <div
      className={`${dim} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0`}
      style={{ backgroundColor: user.avatarColor }}
    >
      {initials}
    </div>
  )
}

// ── Role & Status badges ──────────────────────────────────────

const ROLE_STYLES: Record<UserRole, string> = {
  admin:  'bg-carrot-wash text-carrot',
  editor: 'bg-blue-50 text-blue-600',
  viewer: 'bg-paper-soft text-coal-muted',
}

const STATUS_STYLES: Record<UserStatus, string> = {
  active:   'bg-green-50 text-green-600',
  inactive: 'bg-red-50 text-red-500',
  pending:  'bg-amber-50 text-amber-600',
}

function RoleBadge({ role }: { role: UserRole }) {
  return (
    <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-semibold capitalize ${ROLE_STYLES[role]}`}>
      {role}
    </span>
  )
}

function StatusBadge({ status }: { status: UserStatus }) {
  return (
    <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-semibold capitalize ${STATUS_STYLES[status]}`}>
      {status}
    </span>
  )
}

// ── Backdrop ──────────────────────────────────────────────────

function Backdrop({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-coal/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {children}
    </div>
  )
}

// ── User Modal (Add / Edit) ───────────────────────────────────

interface UserFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  department: string
  jobTitle: string
  role: UserRole
  status: UserStatus
}

const AVATAR_COLORS = [
  '#F95D0E', '#7C3AED', '#0891B2', '#DB2777',
  '#059669', '#DC2626', '#D97706', '#0284C7',
  '#16A34A', '#9333EA', '#0F172A', '#BE185D',
  '#1D4ED8', '#7C3AED', '#0891B2',
]

function randomAvatarColor(): string {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]
}

function generateTempPassword(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  let result = ''
  for (let i = 0; i < 8; i++) result += chars[Math.floor(Math.random() * chars.length)]
  return result
}

function UserModal({
  user,
  onSave,
  onClose,
}: {
  user: AdminUser | null
  onSave: (data: UserFormData, tempPass?: string) => void
  onClose: () => void
}) {
  const isEdit = Boolean(user)
  const [form, setForm] = useState<UserFormData>({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
    department: user?.department ?? '',
    jobTitle: user?.jobTitle ?? '',
    role: user?.role ?? 'viewer',
    status: user?.status ?? 'active',
  })
  const [created, setCreated] = useState<{ tempPass: string } | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isEdit) {
      const tempPass = generateTempPassword()
      setCreated({ tempPass })
      onSave(form, tempPass)
    } else {
      onSave(form)
    }
  }

  const inputClass = 'w-full rounded-xl border border-paper-line bg-paper-soft px-3.5 py-2.5 text-[13px] text-coal outline-none focus:border-carrot transition-colors'
  const labelClass = 'block text-[11px] font-semibold text-coal-dim uppercase tracking-widest mb-1.5'

  if (created) {
    return (
      <Backdrop onClose={onClose}>
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
          <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
            <Check size={22} className="text-green-500" />
          </div>
          <h2 className="font-bold text-coal text-[16px] mb-2">User Created</h2>
          <p className="text-[13px] text-coal-muted mb-4">Share this temporary password with the new user.</p>
          <div className="bg-paper-soft rounded-xl px-4 py-3 font-mono text-[16px] font-bold text-coal tracking-widest mb-6 border border-paper-line">
            {created.tempPass}
          </div>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-carrot text-white text-[13px] font-semibold hover:bg-carrot-deep transition-colors"
          >
            Done
          </button>
        </div>
      </Backdrop>
    )
  }

  return (
    <Backdrop onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-paper-line sticky top-0 bg-white z-10">
          <h2 className="font-semibold text-coal text-[15px]">{isEdit ? 'Edit User' : 'Add User'}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl text-coal-muted hover:bg-paper-soft transition-colors">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>First Name *</label>
              <input required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Last Name *</label>
              <input required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Email *</label>
            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Phone</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+63 917 000 0000" className={inputClass} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Department</label>
              <input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Job Title</label>
              <input value={form.jobTitle} onChange={(e) => setForm({ ...form, jobTitle: e.target.value })} className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Role</label>
              <SelectField value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })} className={inputClass}>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </SelectField>
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <SelectField value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as UserStatus })} className={inputClass}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </SelectField>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-paper-line text-[13px] font-semibold text-coal-muted hover:bg-paper-soft transition-colors">
              Cancel
            </button>
            <button type="submit" className="flex-1 py-2.5 rounded-xl bg-carrot text-white text-[13px] font-semibold hover:bg-carrot-deep transition-colors">
              {isEdit ? 'Save Changes' : 'Add User'}
            </button>
          </div>
        </form>
      </div>
    </Backdrop>
  )
}

function DeleteUserModal({ user, onConfirm, onClose }: { user: AdminUser; onConfirm: () => void; onClose: () => void }) {
  return (
    <Backdrop onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={22} className="text-red-500" />
        </div>
        <h2 className="font-bold text-coal text-[16px] mb-2">Delete User?</h2>
        <p className="text-[13px] text-coal-muted mb-6 leading-relaxed">
          <span className="font-semibold text-coal">{user.firstName} {user.lastName}</span> will be permanently removed.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-paper-line text-[13px] font-semibold text-coal-muted hover:bg-paper-soft transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-[13px] font-semibold hover:bg-red-600 transition-colors">
            Delete
          </button>
        </div>
      </div>
    </Backdrop>
  )
}

// ── My Account Tab ────────────────────────────────────────────

function AccountTab({ onToast }: { onToast: (msg: string) => void }) {
  const [profile, setProfile] = useState({
    firstName: 'Alex',
    lastName: 'Reyes',
    email: 'alex.reyes@velocita.ph',
    phone: '+63 917 000 0000',
    jobTitle: 'System Administrator',
    department: 'IT',
    bio: '',
  })

  const [security, setSecurity] = useState({ current: '', newPass: '', confirm: '' })
  const [resetEmail, setResetEmail] = useState('alex.reyes@velocita.ph')

  const inputClass = 'w-full rounded-xl border border-paper-line bg-paper-soft px-3.5 py-2.5 text-[13px] text-coal outline-none focus:border-carrot transition-colors'
  const labelClass = 'block text-[11px] font-semibold text-coal-dim uppercase tracking-widest mb-1.5'

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Profile card */}
      <div className="bg-white rounded-2xl border border-paper-line shadow-sm p-5 space-y-4">
        <h3 className="text-[14px] font-bold text-coal pb-3 border-b border-paper-line">Profile</h3>

        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-carrot flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
            {profile.firstName[0]}{profile.lastName[0]}
          </div>
          <div>
            <div className="text-[14px] font-bold text-coal">{profile.firstName} {profile.lastName}</div>
            <div className="text-[12px] text-coal-muted">{profile.jobTitle} · {profile.department}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>First Name</label>
            <input value={profile.firstName} onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Last Name</label>
            <input value={profile.lastName} onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Email</label>
          <input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Phone (+63)</label>
          <input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} placeholder="+63 917 000 0000" className={inputClass} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Job Title</label>
            <input value={profile.jobTitle} onChange={(e) => setProfile({ ...profile, jobTitle: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Department</label>
            <input value={profile.department} onChange={(e) => setProfile({ ...profile, department: e.target.value })} className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Bio</label>
          <textarea
            rows={3}
            maxLength={300}
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            className={inputClass + ' resize-none'}
            placeholder="A short bio..."
          />
          <p className="text-[11px] text-coal-dim mt-1">{profile.bio.length}/300</p>
        </div>

        <button
          type="button"
          onClick={() => onToast('Profile updated successfully.')}
          className="w-full py-2.5 rounded-xl bg-carrot text-white text-[13px] font-semibold hover:bg-carrot-deep transition-colors"
        >
          Save Changes
        </button>
      </div>

      {/* Security card */}
      <div className="bg-white rounded-2xl border border-paper-line shadow-sm p-5 space-y-4">
        <h3 className="text-[14px] font-bold text-coal pb-3 border-b border-paper-line">Security</h3>

        <div>
          <label className="block text-[11px] font-semibold text-coal-dim uppercase tracking-widest mb-1.5">Current Password</label>
          <input
            type="password"
            value={security.current}
            onChange={(e) => setSecurity({ ...security, current: e.target.value })}
            placeholder="••••••••"
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-coal-dim uppercase tracking-widest mb-1.5">New Password</label>
          <input
            type="password"
            value={security.newPass}
            onChange={(e) => setSecurity({ ...security, newPass: e.target.value })}
            placeholder="••••••••"
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-coal-dim uppercase tracking-widest mb-1.5">Confirm New Password</label>
          <input
            type="password"
            value={security.confirm}
            onChange={(e) => setSecurity({ ...security, confirm: e.target.value })}
            placeholder="••••••••"
            className={inputClass}
          />
        </div>

        <div className="bg-paper-soft rounded-xl p-3 text-[12px] text-coal-muted space-y-1">
          <div className={`flex items-center gap-2 ${security.newPass.length >= 8 ? 'text-green-600' : ''}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${security.newPass.length >= 8 ? 'bg-green-500' : 'bg-coal-dim'}`} />
            Minimum 8 characters
          </div>
          <div className={`flex items-center gap-2 ${/\d/.test(security.newPass) ? 'text-green-600' : ''}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${/\d/.test(security.newPass) ? 'bg-green-500' : 'bg-coal-dim'}`} />
            At least one number
          </div>
        </div>

        <button
          type="button"
          onClick={() => { setSecurity({ current: '', newPass: '', confirm: '' }); onToast('Password changed successfully.') }}
          className="w-full py-2.5 rounded-xl bg-carrot text-white text-[13px] font-semibold hover:bg-carrot-deep transition-colors"
        >
          Change Password
        </button>

        <div className="border-t border-paper-line pt-4 space-y-3">
          <div className="text-[13px] font-semibold text-coal">Reset Password</div>
          <p className="text-[12px] text-coal-muted">Send a password reset link to your email address.</p>
          <input
            type="email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            className={inputClass}
          />
          <button
            type="button"
            onClick={() => onToast(`Reset link sent to ${resetEmail}.`)}
            className="w-full py-2.5 rounded-xl border border-paper-line text-[13px] font-semibold text-coal-muted hover:text-coal hover:bg-paper-soft transition-colors"
          >
            Send Reset Link
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Users Tab ─────────────────────────────────────────────────

function formatLastLogin(date: string): string {
  if (date === 'Never') return 'Never'
  const d = new Date(date)
  if (isNaN(d.getTime())) return date
  return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })
}

type UserModalState =
  | { kind: 'none' }
  | { kind: 'add' }
  | { kind: 'edit'; user: AdminUser }
  | { kind: 'delete'; user: AdminUser }

function UsersTab({ onToast }: { onToast: (msg: string) => void }) {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [modal, setModal] = useState<UserModalState>({ kind: 'none' })

  useEffect(() => { setUsers(getUsers()) }, [])

  function handleSave(data: UserFormData, tempPass?: string) {
    const list = [...users]
    if (modal.kind === 'edit') {
      const idx = list.findIndex((u) => u.id === modal.user.id)
      if (idx >= 0) {
        list[idx] = { ...list[idx], ...data }
        saveUsers(list)
        setUsers(list)
        setModal({ kind: 'none' })
        onToast('User updated.')
      }
    } else {
      const newUser: AdminUser = {
        id: `u-${Date.now()}`,
        ...data,
        lastLogin: 'Never',
        createdAt: new Date().toISOString(),
        avatarColor: randomAvatarColor(),
      }
      const updated = [newUser, ...list]
      saveUsers(updated)
      setUsers(updated)
      if (tempPass) {
        onToast(`User created. Temp password: ${tempPass}`)
      }
    }
  }

  function handleDelete(id: string) {
    const updated = users.filter((u) => u.id !== id)
    saveUsers(updated)
    setUsers(updated)
    setModal({ kind: 'none' })
    onToast('User deleted.')
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[16px] font-bold text-coal">Users</h3>
          <p className="text-[13px] text-coal-muted mt-0.5">{users.length} team members</p>
        </div>
        <button
          onClick={() => setModal({ kind: 'add' })}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-carrot text-white text-[13px] font-semibold hover:bg-carrot-deep transition-colors shadow-sm"
        >
          <Plus size={14} /> Add User
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-paper-line shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-paper-line bg-paper-soft">
                <th className="text-left px-5 py-3 text-[11px] font-bold text-coal-dim uppercase tracking-widest">User</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-coal-dim uppercase tracking-widest">Department</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-coal-dim uppercase tracking-widest hidden md:table-cell">Job Title</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-coal-dim uppercase tracking-widest">Role</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-coal-dim uppercase tracking-widest">Status</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-coal-dim uppercase tracking-widest hidden lg:table-cell">Last Login</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-paper-line">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-paper-soft/50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar user={user} />
                      <div className="min-w-0">
                        <div className="text-[13px] font-semibold text-coal truncate">{user.firstName} {user.lastName}</div>
                        <div className="text-[11px] text-coal-muted truncate">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-coal-muted">{user.department}</td>
                  <td className="px-4 py-3 text-[13px] text-coal-muted hidden md:table-cell">{user.jobTitle}</td>
                  <td className="px-4 py-3"><RoleBadge role={user.role} /></td>
                  <td className="px-4 py-3"><StatusBadge status={user.status} /></td>
                  <td className="px-4 py-3 text-[13px] text-coal-muted hidden lg:table-cell">{formatLastLogin(user.lastLogin)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button
                        onClick={() => setModal({ kind: 'edit', user })}
                        className="w-8 h-8 flex items-center justify-center rounded-xl text-coal-muted hover:text-carrot hover:bg-carrot-wash transition-colors"
                        title="Edit"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => onToast(`Temporary password sent to ${user.email}.`)}
                        className="w-8 h-8 flex items-center justify-center rounded-xl text-coal-muted hover:text-blue-500 hover:bg-blue-50 transition-colors"
                        title="Send Temp Password"
                      >
                        <Key size={13} />
                      </button>
                      <button
                        onClick={() => {
                          if (user.id === 'u-1' || user.email === 'alex.reyes@velocita.ph') {
                            onToast("You can't delete your own account.")
                            return
                          }
                          setModal({ kind: 'delete', user })
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-xl text-coal-muted hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {(modal.kind === 'add' || modal.kind === 'edit') && (
        <UserModal
          user={modal.kind === 'edit' ? modal.user : null}
          onSave={handleSave}
          onClose={() => setModal({ kind: 'none' })}
        />
      )}
      {modal.kind === 'delete' && (
        <DeleteUserModal
          user={modal.user}
          onConfirm={() => handleDelete(modal.user.id)}
          onClose={() => setModal({ kind: 'none' })}
        />
      )}
    </div>
  )
}

// ── Customers Tab ─────────────────────────────────────────────

function CustomersTab({ onToast }: { onToast: (msg: string) => void }) {
  const [customers, setCustomers] = useState<Customer[]>([])

  useEffect(() => { setCustomers(getCustomers()) }, [])

  function handleToggleStatus(id: string) {
    const updated = customers.map(c =>
      c.id === id ? { ...c, status: (c.status === 'active' ? 'inactive' : 'active') as Customer['status'] } : c
    )
    saveCustomers(updated)
    setCustomers(updated)
    const name = customers.find(c => c.id === id)?.name ?? 'Customer'
    const next = updated.find(c => c.id === id)?.status
    onToast(`${name} ${next === 'active' ? 'activated' : 'deactivated'}.`)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[16px] font-bold text-coal">Customers</h3>
          <p className="text-[13px] text-coal-muted mt-0.5">{customers.length} registered customers</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-paper-line shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-paper-line bg-paper-soft">
                <th className="text-left px-5 py-3 text-[11px] font-bold text-coal-dim uppercase tracking-widest">Customer</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-coal-dim uppercase tracking-widest hidden md:table-cell">Phone</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-coal-dim uppercase tracking-widest hidden lg:table-cell">Member Since</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-coal-dim uppercase tracking-widest">Orders</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-coal-dim uppercase tracking-widest">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-paper-line">
              {customers.map((customer) => {
                const initials = customer.name
                  .split(' ')
                  .map(n => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()
                return (
                  <tr key={customer.id} className="hover:bg-paper-soft/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-[13px] flex-shrink-0"
                          style={{ backgroundColor: customer.avatarColor }}
                        >
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <div className="text-[13px] font-semibold text-coal truncate">{customer.name}</div>
                          <div className="text-[11px] text-coal-muted truncate">{customer.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[13px] text-coal-muted hidden md:table-cell">
                      {customer.phone || '—'}
                    </td>
                    <td className="px-4 py-3 text-[13px] text-coal-muted hidden lg:table-cell">
                      {new Date(customer.createdAt).toLocaleDateString('en-PH', {
                        year: 'numeric', month: 'short', day: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-3 text-[13px] font-semibold text-coal">{customer.totalOrders}</td>
                    <td className="px-4 py-3"><StatusBadge status={customer.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => onToast(`Password reset link sent to ${customer.email}.`)}
                          className="w-8 h-8 flex items-center justify-center rounded-xl text-coal-muted hover:text-blue-500 hover:bg-blue-50 transition-colors"
                          title="Send Password Reset"
                        >
                          <Key size={13} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(customer.id)}
                          className={`w-8 h-8 flex items-center justify-center rounded-xl transition-colors ${
                            customer.status === 'active'
                              ? 'text-coal-muted hover:text-red-500 hover:bg-red-50'
                              : 'text-coal-muted hover:text-green-500 hover:bg-green-50'
                          }`}
                          title={customer.status === 'active' ? 'Deactivate' : 'Activate'}
                        >
                          {customer.status === 'active'
                            ? <UserX size={13} />
                            : <UserCheck size={13} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ── Reset Tab ─────────────────────────────────────────────────

function ResetTab({ onToast }: { onToast: (msg: string) => void }) {
  const [confirm, setConfirm] = useState<'products' | 'orders' | 'users' | 'customers' | 'all' | null>(null)
  const { reset: resetNotifs } = useNotifications()

  function doReset(target: typeof confirm) {
    if (target === 'products'  || target === 'all') resetFullProducts()
    if (target === 'orders'    || target === 'all') resetOrders()
    if (target === 'users'     || target === 'all') resetUsers()
    if (target === 'customers' || target === 'all') resetCustomers()
    if (target === 'all') { resetNotifications(); resetNotifs() }
    setConfirm(null)
    const labels: Record<string, string> = {
      products: 'Products', orders: 'Orders', users: 'Users', customers: 'Customers', all: 'Everything',
    }
    onToast(`${labels[target!]} reset to default successfully.`)
  }

  const ITEMS = [
    {
      key: 'products' as const,
      icon: Package,
      iconBg: 'bg-carrot-wash',
      iconColor: 'text-carrot',
      title: 'Reset Products',
      desc: 'Restore all 31 products to their original state. Any edits or deletions in the product catalogue will be undone.',
    },
    {
      key: 'orders' as const,
      icon: ShoppingBag,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-500',
      title: 'Reset Orders',
      desc: 'Restore the 3 sample orders (Vespa, Tire, Helmet). All orders placed via the storefront or status changes will be cleared.',
    },
    {
      key: 'users' as const,
      icon: Users,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-500',
      title: 'Reset Users',
      desc: 'Restore all 15 sample team members with their original roles and statuses. Any edits or additions will be undone.',
    },
    {
      key: 'customers' as const,
      icon: UserCheck,
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600',
      title: 'Reset Customers',
      desc: 'Restore the 8 sample customers. Any accounts registered via the storefront will be removed.',
    },
  ]

  return (
    <div className="space-y-4 max-w-2xl">
      {/* Master reset card */}
      <div className="bg-white rounded-2xl border-2 border-amber-200 shadow-sm p-5">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
              <RotateCcw size={20} className="text-amber-500" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-coal text-[15px]">Reset Everything</h3>
              <p className="text-[13px] text-coal-muted mt-1 leading-relaxed">
                Restore all products, orders, and users back to their original demo state in one click. Use this to quickly undo all changes for a fresh demo.
              </p>
            </div>
          </div>
          <button
            onClick={() => setConfirm('all')}
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-white text-[13px] font-semibold hover:bg-amber-600 transition-colors self-start sm:self-auto"
          >
            <RotateCcw size={14} />
            Reset All
          </button>
        </div>
      </div>

      {/* Individual reset cards */}
      {ITEMS.map(({ key, icon: Icon, iconBg, iconColor, title, desc }) => (
        <div key={key} className="bg-white rounded-2xl border border-paper-line shadow-sm p-5 flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
              <Icon size={20} className={iconColor} />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-coal text-[14px]">{title}</h3>
              <p className="text-[13px] text-coal-muted mt-1 leading-relaxed">{desc}</p>
            </div>
          </div>
          <button
            onClick={() => setConfirm(key)}
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl border border-paper-line text-[13px] font-semibold text-coal-muted hover:text-coal hover:border-coal-dim transition-colors self-start sm:self-auto"
          >
            <RotateCcw size={13} />
            Reset
          </button>
        </div>
      ))}

      {/* Confirm modal */}
      {confirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-coal/40 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setConfirm(null) }}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={22} className="text-amber-500" />
            </div>
            <h2 className="font-bold text-coal text-[16px] mb-2">
              {confirm === 'all' ? 'Reset Everything?' : `Reset ${confirm.charAt(0).toUpperCase() + confirm.slice(1)}?`}
            </h2>
            <p className="text-[13px] text-coal-muted mb-6 leading-relaxed">
              {confirm === 'all'
                ? 'All products, orders, and users will be restored to their original demo state. This cannot be undone.'
                : `All ${confirm} will be restored to their original demo state. This cannot be undone.`}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirm(null)} className="flex-1 py-2.5 rounded-xl border border-paper-line text-[13px] font-semibold text-coal-muted hover:bg-paper-soft transition-colors">
                Cancel
              </button>
              <button onClick={() => doReset(confirm)} className="flex-1 py-2.5 rounded-xl bg-amber-500 text-white text-[13px] font-semibold hover:bg-amber-600 transition-colors">
                Yes, Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Settings Page ─────────────────────────────────────────────

type SettingsTab = 'account' | 'users' | 'customers' | 'reset'

const VALID_TABS: SettingsTab[] = ['account', 'users', 'customers', 'reset']

export default function Settings() {
  const [searchParams] = useSearchParams()
  const [toast, setToast] = useState<string | null>(null)

  const urlTab = searchParams.get('tab') as SettingsTab | null
  const [tab, setTab] = useState<SettingsTab>(
    urlTab && VALID_TABS.includes(urlTab) ? urlTab : 'account'
  )

  // Sync tab when URL param changes (e.g. sidebar link click)
  useEffect(() => {
    const t = searchParams.get('tab') as SettingsTab | null
    if (t && VALID_TABS.includes(t)) setTab(t)
  }, [searchParams])

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-[20px] font-bold text-coal">Settings</h1>
        <p className="text-[13px] text-coal-muted mt-0.5">Manage your account, team, and customers</p>
      </div>

      {/* Tabs */}
      <div className="overflow-x-auto -mx-1 px-1 pb-0.5">
        <div className="flex items-center gap-1 bg-white rounded-xl border border-paper-line p-1 w-max shadow-sm">
          {([
            { key: 'account',   label: 'My Account' },
            { key: 'users',     label: 'Users' },
            { key: 'customers', label: 'Customers' },
            { key: 'reset',     label: 'Reset to Default' },
          ] as const).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-4 sm:px-5 py-1.5 rounded-lg text-[13px] font-semibold transition-all whitespace-nowrap ${
                tab === key
                  ? key === 'reset'
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-carrot text-white shadow-sm'
                  : 'text-coal-muted hover:text-coal hover:bg-paper-soft'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {tab === 'account'   && <AccountTab onToast={setToast} />}
      {tab === 'users'     && <UsersTab onToast={setToast} />}
      {tab === 'customers' && <CustomersTab onToast={setToast} />}
      {tab === 'reset'     && <ResetTab onToast={setToast} />}

      {/* Toast */}
      {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}
    </div>
  )
}
