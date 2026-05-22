import { motion } from "motion/react";
import { useNavigate, useParams } from "react-router";
import { spells } from "../data/spells";
import { MagicalButton } from "../components/MagicalButton";
import { FloatingParticles } from "../components/FloatingParticles";
import { ArrowLeft, Clock, Heart, Sparkles } from "lucide-react";

export default function SpellDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const spell = spells.find((s) => s.id === id);

  if (!spell) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Spell not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 relative overflow-hidden bg-gradient-to-b from-[#faf8fc] to-[#f0ebf5]">
      <FloatingParticles type="sparkles" count={12} color={spell.color} />

      {/* Header */}
      <div className="sticky top-0 z-20 backdrop-blur-md bg-white/60 border-b border-[#d4b5e8]/20 px-6 py-4">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/home")}
            className="p-2 rounded-full bg-white/80 border border-[#d4b5e8]/30"
          >
            <ArrowLeft size={20} className="text-[#4a4458]" />
          </motion.button>
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-[#4a4458]">Spell Details</h1>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 space-y-8">
        {/* Main Spell Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl p-8 shadow-2xl"
          style={{
            background: `linear-gradient(135deg, ${spell.color}60, ${spell.color}90)`,
          }}
        >
          <motion.div
            className="absolute inset-0 opacity-20"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <div className="text-[200px] flex items-center justify-center h-full">
              {spell.icon}
            </div>
          </motion.div>

          <div className="relative z-10 text-center">
            <motion.div
              className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center text-5xl"
              style={{ background: `${spell.color}40` }}
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {spell.icon}
            </motion.div>

            <h2 className="text-3xl font-semibold text-white mb-3">
              {spell.name}
            </h2>
            <p className="text-lg text-white/90 leading-relaxed">
              {spell.description}
            </p>
          </div>
        </motion.div>

        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-[#d4b5e8]/20">
            <div className="flex items-center gap-3 mb-2">
              <Clock size={20} style={{ color: spell.color }} />
              <span className="text-sm text-[#8a7d9e]">Duration</span>
            </div>
            <p className="font-semibold text-[#4a4458]">{spell.duration}</p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-[#d4b5e8]/20">
            <div className="flex items-center gap-3 mb-2">
              <Heart size={20} style={{ color: spell.color }} />
              <span className="text-sm text-[#8a7d9e]">Mood</span>
            </div>
            <p className="font-semibold text-[#4a4458]">{spell.mood}</p>
          </div>
        </div>

        {/* Intention */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 border border-[#d4b5e8]/20">
          <div className="flex items-center gap-3 mb-3">
            <Sparkles size={20} style={{ color: spell.color }} />
            <h3 className="font-semibold text-[#4a4458]">Intention</h3>
          </div>
          <p className="text-[#4a4458] leading-relaxed">{spell.intention}</p>
        </div>

        {/* Affirmation */}
        <div
          className="rounded-3xl p-6 border-2 relative overflow-hidden"
          style={{
            borderColor: spell.color,
            background: `linear-gradient(135deg, ${spell.color}10, ${spell.color}20)`,
          }}
        >
          <motion.div
            className="absolute top-0 right-0 text-6xl opacity-10"
            animate={{
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            💫
          </motion.div>
          <div className="relative z-10">
            <p className="text-sm text-[#8a7d9e] mb-2">Affirmation</p>
            <p className="text-xl text-[#4a4458] italic leading-relaxed">
              "{spell.affirmation}"
            </p>
          </div>
        </div>

        {/* Ingredients */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 border border-[#d4b5e8]/20">
          <h3 className="font-semibold text-[#4a4458] mb-4">
            Ritual Items Needed
          </h3>
          <div className="space-y-3">
            {spell.ingredients.map((ingredient, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: spell.color }}
                />
                <span className="text-[#4a4458]">{ingredient}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Symbolic Meaning */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 border border-[#d4b5e8]/20">
          <h3 className="font-semibold text-[#4a4458] mb-3">Symbolic Meaning</h3>
          <p className="text-[#4a4458] leading-relaxed">
            This ritual combines the symbolic power of these sacred items to create
            a meaningful experience of self-care and intention setting. Each element
            carries its own energy, working together to support your journey.
          </p>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 z-20 p-6 pb-24 backdrop-blur-md bg-white/80 border-t border-[#d4b5e8]/20">
        <MagicalButton
          onClick={() => navigate(`/ritual/${spell.id}`)}
          variant="primary"
          size="lg"
          className="w-full"
        >
          <span className="flex items-center justify-center gap-2">
            <Sparkles size={20} />
            Begin Ritual
          </span>
        </MagicalButton>
      </div>
    </div>
  );
}
