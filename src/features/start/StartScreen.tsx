import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUserStore, AVATARS, type UserProfile } from '@/store/userStore'
import { APP_NAME } from '@/constants/config'

interface StartScreenProps {
  onStart: () => void
}

const avatarEmojis: Record<string, string> = {
  astronaut: '👨‍🚀',
  alien: '👽',
  robot: '🤖',
  rocket: '🚀',
  star: '⭐',
  planet: '🪐',
}

export function StartScreen({ onStart }: StartScreenProps) {
  const { users, addUser, selectUser, deleteUser } = useUserStore()
  const [inputName, setInputName] = useState('')
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0])
  const [showAvatarPicker, setShowAvatarPicker] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  // Filter users that match the input
  const matchingUsers = useMemo(() => {
    if (!inputName.trim()) return users
    const search = inputName.toLowerCase().trim()
    return users.filter((u) => u.name.toLowerCase().includes(search))
  }, [users, inputName])

  // Check if exact name exists
  const exactMatch = useMemo(() => {
    const search = inputName.toLowerCase().trim()
    return users.find((u) => u.name.toLowerCase() === search)
  }, [users, inputName])

  const handleSelectUser = (user: UserProfile) => {
    selectUser(user.id)
    onStart()
  }

  const handleCreateOrSelect = () => {
    const trimmedName = inputName.trim()
    if (trimmedName.length < 2) return

    // If exact match exists, select that user
    if (exactMatch) {
      selectUser(exactMatch.id)
      onStart()
      return
    }

    // Otherwise create new user
    addUser(trimmedName, selectedAvatar)
    onStart()
  }

  const handleDeleteUser = (userId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    deleteUser(userId)
    setConfirmDelete(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputName.trim().length >= 2) {
      handleCreateOrSelect()
    }
  }

  return (
    <div className="min-h-screen bg-space-dark flex flex-col items-center justify-center p-6">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h1 className="text-4xl font-bold text-gold mb-2">{APP_NAME}</h1>
        <p className="text-white/60">Aprende las tablas de multiplicar</p>
      </motion.div>

      {/* Animated rocket */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="text-6xl mb-6"
      >
        🚀
      </motion.div>

      {/* Name input section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-sm"
      >
        <label className="text-white/80 text-lg mb-3 block text-center">
          ¿Cómo te llamas?
        </label>

        <div className="flex gap-2 mb-4">
          {/* Avatar button */}
          <motion.button
            onClick={() => setShowAvatarPicker(!showAvatarPicker)}
            className="w-14 h-14 bg-space-navy rounded-xl flex items-center justify-center text-3xl
                       border-2 border-white/20 hover:border-space-blue transition-colors"
            whileTap={{ scale: 0.95 }}
            title="Cambiar avatar"
          >
            {avatarEmojis[selectedAvatar]}
          </motion.button>

          {/* Name input */}
          <input
            type="text"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu nombre..."
            maxLength={15}
            className="flex-1 bg-space-navy text-white text-lg px-4 py-3 rounded-xl
                       border-2 border-white/20 focus:border-space-blue focus:outline-none
                       placeholder:text-white/30"
            autoFocus
          />
        </div>

        {/* Avatar picker */}
        <AnimatePresence>
          {showAvatarPicker && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 overflow-hidden"
            >
              <div className="bg-space-navy/50 rounded-xl p-3">
                <p className="text-white/60 text-sm mb-2">Elige tu avatar:</p>
                <div className="flex gap-2 justify-center">
                  {AVATARS.map((avatar) => (
                    <motion.button
                      key={avatar}
                      onClick={() => {
                        setSelectedAvatar(avatar)
                        setShowAvatarPicker(false)
                      }}
                      className={`
                        w-12 h-12 rounded-xl flex items-center justify-center text-2xl
                        transition-all
                        ${selectedAvatar === avatar
                          ? 'bg-space-blue ring-2 ring-gold'
                          : 'bg-space-dark/50 hover:bg-space-dark'}
                      `}
                      whileTap={{ scale: 0.9 }}
                    >
                      {avatarEmojis[avatar]}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Play button */}
        <motion.button
          onClick={handleCreateOrSelect}
          disabled={inputName.trim().length < 2}
          className={`
            w-full py-4 rounded-xl text-lg font-bold mb-6 transition-all
            ${inputName.trim().length >= 2
              ? 'bg-gradient-to-r from-space-blue to-space-purple text-white shadow-lg shadow-space-purple/30'
              : 'bg-space-navy/50 text-white/30'}
          `}
          whileTap={inputName.trim().length >= 2 ? { scale: 0.98 } : undefined}
        >
          {exactMatch ? `¡Jugar como ${exactMatch.name}!` : '¡Empezar a jugar!'}
        </motion.button>

        {/* Existing users list */}
        {matchingUsers.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2"
          >
            <p className="text-white/50 text-sm text-center mb-2">
              {inputName.trim() ? 'Jugadores encontrados:' : 'Jugadores anteriores:'}
            </p>
            <div className="max-h-48 overflow-y-auto space-y-2">
              {matchingUsers.map((user) => (
                <motion.div
                  key={user.id}
                  className={`
                    relative bg-space-navy/60 rounded-xl p-3 flex items-center gap-3
                    cursor-pointer transition-all
                    ${exactMatch?.id === user.id
                      ? 'ring-2 ring-gold bg-space-navy/80'
                      : 'hover:bg-space-navy/80'}
                  `}
                  onClick={() => handleSelectUser(user)}
                  whileTap={{ scale: 0.98 }}
                  layout
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 bg-space-dark/50 rounded-full flex items-center justify-center text-xl">
                    {avatarEmojis[user.avatar] || '👤'}
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{user.name}</p>
                  </div>

                  {/* Delete button */}
                  {confirmDelete === user.id ? (
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <motion.button
                        onClick={(e) => handleDeleteUser(user.id, e)}
                        className="px-2 py-1 bg-warning text-white text-xs rounded-lg font-medium"
                        whileTap={{ scale: 0.95 }}
                      >
                        Sí
                      </motion.button>
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation()
                          setConfirmDelete(null)
                        }}
                        className="px-2 py-1 bg-space-dark text-white text-xs rounded-lg"
                        whileTap={{ scale: 0.95 }}
                      >
                        No
                      </motion.button>
                    </div>
                  ) : (
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation()
                        setConfirmDelete(user.id)
                      }}
                      className="w-8 h-8 bg-space-dark/50 rounded-full flex items-center justify-center
                                 text-white/30 hover:text-warning hover:bg-warning/20 transition-colors"
                      whileTap={{ scale: 0.9 }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </motion.button>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
