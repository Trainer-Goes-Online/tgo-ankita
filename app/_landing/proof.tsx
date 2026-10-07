'use client';

/**
 * The two proof beats, exported SEPARATELY because they no longer sit together:
 *
 *   2.5 Real Fertility Journeys  · four clips, then two screenshot rails.
 *                                 Hoisted to the top of ./below-fold on
 *                                 24 Sep 2026, so the first thing under the
 *                                 offer is other people saying it worked.
 *   6   Does this sound like you?  · the self-recognition list. It did NOT move
 *                                 with the clips: it is the turn in the
 *                                 argument rather than a proof beat, and it
 *                                 only works once the reader knows what the
 *                                 thing is.
 *
 * COPY IS VERBATIM. The emphasis inside each recognition line is TYPOGRAPHY,
 * not an edit: the words and their order are exactly as written.
 *
 * ⚠️ NO PROOF ASSETS EXIST. /public is empty. The source names four
 * testimonials and two screenshot walls (seven moving right to left, six
 * moving left to right) and links a Drive folder that holds them. Every slot
 * below is reserved at the ratio the real asset will take and labelled with
 * what belongs in it. Nothing here invents a name, a quote, a city, a star
 * rating or a result.
 */
import { ArrowRight, Play } from '@phosphor-icons/react/dist/ssr';
import { useState } from 'react';

import { asset } from './asset-version';
import { legoDelay } from './lego-style';
import { C, MediaPlaceholder, SectionHeading } from './shared';

/* ══ 6 · Does this sound like you? ═════════════════════════════════════════
   A one-sided list: every line is meant to be recognised, so there is no
   second column and nothing to weigh against.

   The source marks each line with 👉. It renders as a small arrow in the coral
   bed rather than as a tick: these seven lines are the reader's situation, not
   features of the offer, and a green tick beside "You've already tried
   medications, IUI or IVF" reads as a benefit being sold. */
const RECOGNITION: [string, string, string][] = [
  [
    'You’re in your ',
    '"Zero Trimester"',
    ' - the pre-conception phase where you want to start preparing your body, cycle and daily habits before pregnancy begins.',
  ],
  [
    'You’re married and ',
    'planning to conceive in the coming months',
    ', and want to prepare your body beforehand for a healthier conception journey.',
  ],
  [
    'You’ve been trying to conceive, but ',
    'PCOS, thyroid, endometriosis, irregular cycles or unexplained fertility concerns',
    ' keep making the journey feel harder.',
  ],
  [
    'You’ve already tried ',
    'medications, IUI or IVF',
    ', but still haven’t got the result you were hoping for.',
  ],
  [
    'Your doctor has told you to ',
    'lose weight or improve your health before trying to conceive',
    ', but you’re not sure what kind of movement or routine is actually right for you.',
  ],
  [
    'You feel like you’re doing a lot for your health, but ',
    'still don’t know whether your body is actually prepared for conception',
    '.',
  ],
  [
    'You’re tired of ',
    'piecing together fertility advice on your own',
    ' and want clear, structured guidance on what to focus on first.',
  ],
];

export function Recognition() {
  return (
    <section className="px-4 py-12 sm:py-20 lg:py-24" style={{ background: C.canvas }}>
      <SectionHeading>
        Does this <span style={{ color: C.goldDeep }}>sound like you</span>?
      </SectionHeading>

      {/* Seven quiet rows rather than seven cards: the beat wants to be READ,
          not scanned. The shadow is the page's softest, so a stack of them
          reads as sheets and not as buttons. */}
      <ul className="mx-auto mt-12 grid max-w-[820px] gap-3">
        {RECOGNITION.map(([pre, hl, post], idx) => (
          <li
            key={hl}
            data-lego=""
            className="lego-hover-sm flex items-start gap-4 rounded-2xl px-5 py-4"
            style={{
              ...legoDelay(idx),
              background: C.surface,
              border: `1px solid ${C.line}`,
              boxShadow: '0 18px 44px -26px rgba(46,33,64,0.30)',
            }}
          >
            <span
              className="lego-stud mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg"
              style={{ background: C.coralBed }}
              aria-hidden
            >
              <ArrowRight weight="bold" className="h-[11px] w-[11px]" style={{ color: C.coralInk }} />
            </span>
            <span className="text-[15px] leading-relaxed" style={{ color: C.inkSoft }}>
              {pre}
              <strong style={{ color: C.ink, fontWeight: 700 }}>{hl}</strong>
              {post}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ══ 7 · Real Fertility Journeys ═══════════════════════════════════════════

   16:9 for the clips, which is the default a supplied testimonial video
   arrives on. If the four come in as vertical phone recordings, change
   CLIP_RATIO to '9 / 16' and nothing else moves.

   SHOT_RATIO governs the RESERVED boxes only. A message screenshot is nothing
   but burned-in type, so a real one is never cropped to a tile: the rail sets
   a fixed height and each file keeps its own natural width. */
const CLIP_RATIO = '16 / 9';
const SHOT_RATIO = '4 / 5';

type Clip = {
  /** The label the clip is delivered under. Used for the accessible name. */
  label: string;
  /** A YouTube id. The embed brings its own thumbnail and play button, so a
   *  wired clip needs no poster file. */
  youtubeId?: string;
  /** A Vimeo id, for a clip delivered there instead. */
  vimeoId?: string;
  /** Fallback: an mp4 under /public, referenced through asset(). */
  src?: string;
  /** Poster frame under /public. Required for either playback route. */
  poster?: string;
  /** The speaker's name, shown under the frame. Only ever set from a real
   *  supplied name. */
  name?: string;
};

/* YouTube serves a thumbnail per video, so a wired clip needs no poster file
   from the client. `hqdefault` not `maxresdefault`: Amrita's has no maxres
   and would 404 into an empty frame. */
const ytThumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

/* Supplied 24 Sep 2026. Five, where the source reserved four. Names are the
   client's own, from the video titles. No quote and no result is attached to
   any of them, because none was supplied. */
const CLIPS: Clip[] = [
  { label: 'Heena Patel', name: 'Heena Patel', youtubeId: 'yA-oyJtqgDk' },
  { label: 'Neha', name: 'Neha', youtubeId: '6nl5ZlgJM6E' },
  { label: 'Aditi Rastogi', name: 'Aditi Rastogi', youtubeId: 'Q3j7Gf5c6Ns' },
  { label: 'Nisha', name: 'Nisha', youtubeId: 'M9MFsN4_ZBU' },
  { label: 'Amrita', name: 'Amrita', youtubeId: 's7By02i8tZc' },
];

/**
 * One exhibit card: a frame in a mat, so it reads as a case file rather than
 * as a quote box, with an on-brand play disc instead of a platform-red
 * triangle.
 *
 * Posters, not players: thirteen embeds on one band is thirteen player
 * documents fighting for the main thread. The clicked card, and only that one,
 * becomes a player.
 */
/* The scrim and the on-brand play disc, shared by the YouTube card and the
   reserved-slot card so the two never drift apart. */
function PlayDisc() {
  return (
    <>
      <span
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(17,12,24,0.10) 0%, rgba(17,12,24,0.12) 55%, rgba(17,12,24,0.60) 100%)',
        }}
      />
      <span
        aria-hidden
        className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full transition-transform duration-300 group-hover:scale-105"
        style={{
          background: C.surface,
          boxShadow:
            'inset 0 0 0 1px rgba(220,203,238,0.45), 0 10px 26px -10px rgba(0,0,0,0.7)',
        }}
      >
        <Play weight="fill" className="h-5 w-5 translate-x-[1px]" style={{ color: C.ink }} />
      </span>
    </>
  );
}

function ClipCard({
  clip,
  playing,
  onPlay,
  interactive = true,
  className = '',
}: {
  clip: Clip;
  playing: boolean;
  onPlay: () => void;
  /** False on the rail's duplicate copy: it is decorative, so it never
   *  becomes a player and never takes focus. */
  interactive?: boolean;
  className?: string;
}) {
  const hasVideo = Boolean(clip.youtubeId || clip.vimeoId || clip.src);

  return (
    <article
      className={`rounded-3xl p-3 ${className}`}
      style={{
        background: C.surface,
        border: `1px solid ${C.lineStrong}`,
      }}
    >
      <div
        className="relative flex items-center justify-center overflow-hidden rounded-2xl"
        style={{
          aspectRatio: CLIP_RATIO,
          background: C.navyDeep,
          boxShadow: hasVideo ? 'inset 0 0 0 1px rgba(220,203,238,0.28)' : undefined,
        }}
      >
        {!hasVideo ? (
          <MediaPlaceholder
            ratio={CLIP_RATIO}
            label={`${clip.label} · 16:9`}
            className="h-full w-full"
          />
        ) : clip.youtubeId ? (
          playing ? (
            /* autoplay=1 because the reader has already asked for it. */
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${clip.youtubeId}?rel=0&modestbranding=1&autoplay=1`}
              title={`${clip.name ?? clip.label}, testimonial`}
              allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          ) : (
            <button
              type="button"
              onClick={interactive ? onPlay : undefined}
              disabled={!interactive}
              tabIndex={interactive ? undefined : -1}
              className="group absolute inset-0 h-full w-full cursor-pointer"
              aria-label={`Play ${clip.name ?? clip.label}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ytThumb(clip.youtubeId)}
                alt=""
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <PlayDisc />
            </button>
          )
        ) : playing ? (
          clip.vimeoId ? (
            /* autoplay=1 because the reader has already asked for it by
               clicking; mounting it paused would need a second click. */
            <iframe
              src={`https://player.vimeo.com/video/${clip.vimeoId}?dnt=1&autoplay=1&title=0&byline=0&portrait=0`}
              title={`${clip.name ?? clip.label}, testimonial`}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="absolute inset-0 h-full w-full border-0"
            />
          ) : (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <video
              src={asset(clip.src!)}
              poster={clip.poster ? asset(clip.poster) : undefined}
              controls
              autoPlay
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            />
          )
        ) : (
          <button
            type="button"
            onClick={onPlay}
            className="group absolute inset-0 h-full w-full cursor-pointer"
            aria-label={`Play ${clip.name ?? clip.label}`}
          >
            {clip.poster && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={asset(clip.poster)}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
            <span
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(180deg, rgba(17,12,24,0.10) 0%, rgba(17,12,24,0.12) 55%, rgba(17,12,24,0.60) 100%)',
              }}
            />
            <span
              aria-hidden
              className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full transition-transform duration-300 group-hover:scale-105"
              style={{
                background: C.surface,
                boxShadow: 'inset 0 0 0 1px rgba(220,203,238,0.45)',
              }}
            >
              <Play weight="fill" className="h-5 w-5 translate-x-[1px]" style={{ color: C.ink }} />
            </span>
          </button>
        )}
      </div>

      {clip.name && (
        <p
          className="px-2 pb-1 pt-3 text-center text-[11px] font-bold uppercase tracking-[0.14em]"
          style={{ color: C.inkSoft }}
        >
          {clip.name}
        </p>
      )}
    </article>
  );
}

/**
 * One screenshot in a mat, reserved until the file lands.
 *
 * `alt` is not optional decoration here. The whole of this beat's evidence is
 * type locked inside a picture, so without a transcription the proof section is
 * empty to a screen reader and to anything else reading the page. Set it from
 * what the message actually says when the file is wired.
 */
type Shot = { src?: string; alt?: string; label: string };

/* Supplied 24 Sep 2026 in /public/testimonials. Seventeen files arrived but
   EIGHT are byte-identical duplicates of the other eight (the IMG_2025... set
   is the same images under camera names), so nine unique screenshots are
   wired: five in the first rail, four in the second. Showing a duplicate in a
   proof rail reads as padding.

   Paths are percent-encoded: the supplied names carry spaces.

   `alt` is written from the client's own filename, which is the only
   description supplied. A real transcription of each message is better and is
   on the blocked list: this beat's whole argument is type inside a picture. */
const SHOTS_RIGHT_TO_LEFT: Shot[] = [
  { src: '/testimonials/Hormonal%20Imb.jpg', alt: 'Client message about hormonal imbalance', label: 'Screenshot 1' },
  { src: '/testimonials/Hormonal%20Imb%20Conception.jpg', alt: 'Client message about hormonal imbalance and conception', label: 'Screenshot 2' },
  { src: '/testimonials/Hprmonal%20Happy%20Conception.jpg', alt: 'Client message about hormones and a happy conception', label: 'Screenshot 3' },
  { src: '/testimonials/good%20news.jpg', alt: 'Client message sharing good news', label: 'Screenshot 4' },
  { src: '/testimonials/Affirmations.jpg', alt: 'Client message about affirmations', label: 'Screenshot 5' },
];

const SHOTS_LEFT_TO_RIGHT: Shot[] = [
  { src: '/testimonials/Imp%20of%20Prenatal%20Journey.jpg', alt: 'Client message about the importance of the prenatal journey', label: 'Screenshot 6' },
  { src: '/testimonials/Prenatal%20Connection%20with%20other%20mothers.jpg', alt: 'Client message about connecting with other mothers', label: 'Screenshot 7' },
  { src: '/testimonials/Prenatal%20Connections%20continued.jpg', alt: 'Client message about prenatal connections', label: 'Screenshot 8' },
  { src: '/testimonials/Postnatal%20Recovery.jpg', alt: 'Client message about postnatal recovery', label: 'Screenshot 9' },
];

/**
 * A self-scrolling row.
 *
 * The track holds the set TWICE and travels exactly -50%, which is what makes
 * the loop seamless: at the reset the second copy sits precisely where the
 * first began. The duplicate is aria-hidden, so a screen reader hears each
 * screenshot once.
 *
 * FIXED HEIGHT, NATURAL WIDTH, NO CROP. These are screenshots of messages, so
 * every pixel of them is somebody's words. Tiling them to a uniform box with
 * object-cover would slice the testimony off the top or the bottom of each one.
 * Ragged widths are correct here: it reads as a set of real messages rather
 * than as a designed grid, which is what the evidence is.
 */
function ShotRail({
  shots,
  reverse = false,
  label,
}: {
  shots: Shot[];
  reverse?: boolean;
  label: string;
}) {
  return (
    <div className="kz-rail" role="region" aria-label={label}>
      <div className={`kz-rail-track kz-rail-track--shots${reverse ? ' kz-rail-track--reverse' : ''}`}>
        {[0, 1].map((copy) =>
          shots.map((shot, idx) => (
            <figure
              key={`${copy}-${idx}`}
              data-rail-copy={copy === 1 ? '2' : '1'}
              aria-hidden={copy === 1 ? true : undefined}
              className="h-[290px] w-auto shrink-0 overflow-hidden rounded-2xl p-2 sm:h-[350px]"
              style={{ border: `1px solid ${C.line}`, background: C.surface }}
            >
              {shot.src ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={asset(shot.src)}
                  alt={shot.alt ?? ''}
                  loading="lazy"
                  decoding="async"
                  className="block h-full w-auto rounded-xl"
                />
              ) : (
                <MediaPlaceholder
                  ratio={SHOT_RATIO}
                  label={`${shot.label} · 4:5`}
                  className="h-full w-auto"
                />
              )}
            </figure>
          )),
        )}
      </div>
    </div>
  );
}

export function Testimonials() {
  const [playingKey, setPlayingKey] = useState<string | null>(null);

  return (
    <section className="px-4 py-12 sm:py-20 lg:py-24" style={{ background: C.canvas }}>
      <SectionHeading sub="Some came after months of trying. Some after failed IUI/IVF. Some with no clear answers. These are the women who eventually went on to conceive.">
        Real Fertility Journeys From Women Who Were{' '}
        <span style={{ color: C.goldDeep }}>Struggling to Conceive</span>
      </SectionHeading>

      {/* An auto-scrolling rail, not a grid. It pauses on hover and on
          focus-within, and `data-playing` stops it while a clip is open, so it
          can never slide out from under someone reaching for a play button.

          THUMBNAILS, NOT TEN PLAYERS. The track renders its cards twice to
          loop without a seam, and five live embeds duplicated is ten YouTube
          player documents on a band that sits near the top of the page. The
          duplicate copy is images only and is inert; the clicked card, and
          only that one, becomes a player. */}
      <div
        className="kz-rail mt-14"
        role="region"
        aria-label="Testimonial videos"
        data-playing={playingKey ? 'true' : undefined}
      >
        <div className="kz-rail-track">
          {[0, 1].map((copy) =>
            CLIPS.map((clip) => (
              <div
                key={`${copy}-${clip.label}`}
                data-rail-copy={copy === 1 ? '2' : '1'}
                aria-hidden={copy === 1 ? true : undefined}
                className="w-[300px] shrink-0 sm:w-[380px]"
              >
                <ClipCard
                  clip={clip}
                  className="w-full"
                  playing={copy === 0 && playingKey === clip.label}
                  interactive={copy === 0}
                  onPlay={() => setPlayingKey(clip.label)}
                />
              </div>
            )),
          )}
        </div>
      </div>

      {/* The two walls the source asks for, in its own two directions: seven
          travelling right to left, then six travelling left to right. They sit
          OUTSIDE the column so they run the full width of the band. */}
      <div className="-mx-4 mt-4 space-y-4">
        <ShotRail shots={SHOTS_RIGHT_TO_LEFT} label="Message screenshots, first wall" />
        <ShotRail shots={SHOTS_LEFT_TO_RIGHT} reverse label="Message screenshots, second wall" />
      </div>
    </section>
  );
}
