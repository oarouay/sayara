"use client"

interface HeaderProps {
  onLogin: () => void
  onRegister: () => void
}

export default function Header({ onLogin, onRegister }: HeaderProps) {
  return (
    <header className="bg-green-600 text-white px-6 py-4 flex justify-between items-center">
      <div className="text-2xl font-bold">Sayara</div>
      <div className="flex gap-4">
        <button onClick={onLogin}>Sign in</button>
        <button onClick={onRegister} className="bg-white text-green-600 px-3 py-1 rounded hover:bg-gray-100">
          Register
        </button>
      </div>
    </header>
  )
}
