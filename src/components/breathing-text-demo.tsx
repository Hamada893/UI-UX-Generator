import BreathingText from "@/src/components/ui/breathing-text"

export default function BreathingTextDemo({words}: {words: string}) {
  return (
    <BreathingText
      staggerDuration={0.08}
      fromFontVariationSettings="'wght' 100, 'slnt' 0"
      toFontVariationSettings="'wght' 800, 'slnt' -10"
    >
      {words}
    </BreathingText>
  )
}
