import { motion } from "motion/react";
import { useAppStore } from "@/store/useAppStore";
import { DeferredParticles } from "@/app/components/DeferredParticles";
import { downloadDataUrl } from "@/app/lib/wallpaperGenerator";
import { Download, Image } from "lucide-react";

export default function Wallpapers() {
  const wallpapers = useAppStore((s) => s.wallpapers);

  return (
    <div className="min-h-screen pb-28 relative overflow-hidden">
      <DeferredParticles type="stars" count={6} delayMs={400} />

      <div className="sticky top-0 z-20 backdrop-blur-md bg-white/60 border-b border-[#d4b5e8]/20 px-6 py-4">
        <h1 className="text-2xl font-semibold text-[#4a4458]">Wallpaper Gallery</h1>
        <p className="text-sm text-[#8a7d9e]">Your ritual memories as art</p>
      </div>

      <div className="px-6 py-6">
        {wallpapers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <motion.span
              className="text-6xl block mb-4"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              🖼️
            </motion.span>
            <h2 className="text-xl font-semibold text-[#4a4458] mb-2">No wallpapers yet</h2>
            <p className="text-[#8a7d9e] max-w-xs mx-auto">
              Complete a ritual and download a wallpaper to fill this dreamy gallery
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {wallpapers.map((wp, i) => (
              <motion.div
                key={wp.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-3xl overflow-hidden border border-white/60 shadow-lg bg-white/50"
              >
                {wp.dataUrl ? (
                  <img
                    src={wp.dataUrl}
                    alt={wp.spellName}
                    loading="lazy"
                    decoding="async"
                    className="w-full aspect-[9/16] object-cover"
                  />
                ) : (
                  <div
                    className="aspect-[9/16] flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${wp.themeColor}40, ${wp.themeColor}80)` }}
                  >
                    <Image size={48} className="text-white/50" />
                  </div>
                )}
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-[#4a4458]">{wp.spellName}</h3>
                    <p className="text-xs text-[#8a7d9e]">
                      {new Date(wp.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {wp.dataUrl && (
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() =>
                        downloadDataUrl(wp.dataUrl!, `${wp.spellName}-wallpaper.png`)
                      }
                      className="p-3 rounded-full bg-[#d4b5e8]/30 text-[#4a4458]"
                    >
                      <Download size={18} />
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
