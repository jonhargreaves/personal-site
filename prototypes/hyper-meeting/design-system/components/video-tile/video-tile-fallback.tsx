import { cn } from "../../lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";

interface VideoTileFallbackProps {
  /** Background color for the avatar */
  avatarColor?: string;
  /** Custom avatar image URL */
  avatarImage?: string | null;
  /** Additional CSS classes for the container */
  className?: string;
  /** User initials to display in the avatar */
  initials: string;
  /** Whether the user is currently speaking */
  isSpeaking?: boolean;
}

/**
 * VideoTileFallback displays a "no video" state for participant tiles.
 * Uses a theme panel color for background with a colored avatar.
 * Shows expanding ripple rings when the user is speaking.
 *
 * @example
 * ```tsx
 * <div className="relative h-64 w-96">
 *   <VideoTileFallback
 *     initials="JD"
 *     avatarColor="#3b82f6"
 *     isSpeaking={false}
 *   />
 * </div>
 * ```
 */
export function VideoTileFallback({
  initials,
  avatarColor,
  isSpeaking = false,
  className,
  avatarImage,
}: VideoTileFallbackProps) {
  return (
    <div
      className={cn(
        "@container absolute inset-0 flex items-center justify-center",
        // Use muted background for contrast, lighter in dark mode
        "bg-muted shadow-md dark:bg-neutral-800",
        className
      )}
      data-slot="video-tile-fallback"
    >
      {/* Avatar with speaking indicator rings */}
      <div className="relative">
        {/* Expanding ripple rings when speaking - staggered animations */}
        {isSpeaking && (
          <>
            <div
              className="pointer-events-none absolute inset-0 rounded-full border-primary"
              style={{
                animation: "speaking-ripple 2.4s ease-out infinite",
                borderStyle: "solid",
              }}
            />
            <div
              className="pointer-events-none absolute inset-0 rounded-full border-primary"
              style={{
                animation: "speaking-ripple 2.4s ease-out infinite",
                animationDelay: "0.8s",
                borderStyle: "solid",
              }}
            />
            <div
              className="pointer-events-none absolute inset-0 rounded-full border-primary"
              style={{
                animation: "speaking-ripple 2.4s ease-out infinite",
                animationDelay: "1.6s",
                borderStyle: "solid",
              }}
            />
          </>
        )}
        {/* Avatar adapts to container size using container queries */}
        <Avatar className="@lg:size-32 @md:size-28 @sm:size-24 @xs:size-20 size-14 font-semibold">
          {avatarImage && (
            <AvatarImage
              alt={initials}
              className="object-cover"
              draggable={false}
              src={avatarImage}
            />
          )}
          <AvatarFallback
            className="@lg:text-4xl @md:text-3xl @sm:text-2xl @xs:text-xl text-base text-white"
            style={avatarColor ? { backgroundColor: avatarColor } : undefined}
          >
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
