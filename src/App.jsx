import React, { useState, useEffect, useRef, useMemo } from "react";

/* ============================================================
   FIT TRACKER — Elena Faraci
   Schede: Posturale (4-5x/sett) · Blocco 1 Giorno 1 · Giorno 2
   ============================================================ */

const C = {
  bg: "#160B11",
  surface: "#241219",
  surface2: "#2F1821",
  line: "#43222F",
  wine: "#8C2B4A",
  rose: "#E9718F",
  roseSoft: "#F3B8C6",
  cream: "#F6EDE7",
  dim: "#B08D99",
  green: "#7FC8A9",
  gold: "#E8B04B",
};

/* ---------------- ANIMAZIONI SVG (stick figures) ---------------- */

const S = { fill: "none", stroke: C.roseSoft, strokeWidth: 5, strokeLinecap: "round", strokeLinejoin: "round" };
const S2 = { ...S, stroke: C.rose };

function Anim({ type }) {
  const svgs = {
    /* sdraiata, gambe 90/90, pancia che pulsa */
    breathe: (
      <svg viewBox="0 0 120 90">
        <line x1="10" y1="72" x2="110" y2="72" stroke={C.line} strokeWidth="4" strokeLinecap="round" />
        <circle cx="22" cy="62" r="7" {...S} />
        <path d="M29 64 L62 66" {...S} />
        <path d="M62 66 L74 44 L94 44" {...S2} />
        <path d="M36 64 L44 50" {...S} />
        <circle cx="50" cy="60" r="6" fill={C.rose} stroke="none">
          <animate attributeName="r" values="4;8;4" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0.9;0.5" dur="3s" repeatCount="indefinite" />
        </circle>
      </svg>
    ),
    /* respirazione toracica: torace che pulsa */
    breatheChest: (
      <svg viewBox="0 0 120 90">
        <line x1="10" y1="72" x2="110" y2="72" stroke={C.line} strokeWidth="4" strokeLinecap="round" />
        <circle cx="20" cy="63" r="7" {...S} />
        <path d="M27 65 L70 66 L98 66" {...S} />
        <rect x="34" y="52" width="14" height="8" rx="4" fill={C.line} />
        <circle cx="41" cy="58" r="6" fill={C.rose} stroke="none">
          <animate attributeName="r" values="4;9;4" dur="3.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0.95;0.5" dur="3.5s" repeatCount="indefinite" />
        </circle>
      </svg>
    ),
    /* serratus wall slide: braccia che scorrono sul muro */
    wallslide: (
      <svg viewBox="0 0 120 90">
        <line x1="92" y1="8" x2="92" y2="82" stroke={C.line} strokeWidth="4" strokeLinecap="round" />
        <circle cx="58" cy="26" r="7" {...S} />
        <path d="M60 33 L58 62 L52 82" {...S} />
        <path d="M58 62 L64 82" {...S} />
        <g>
          <path d="M61 38 L78 34 L88 30" {...S2} />
          <animateTransform attributeName="transform" type="translate" values="0 10; 0 -14; 0 10" dur="2.6s" repeatCount="indefinite" />
        </g>
      </svg>
    ),
    /* retrazioni scapolari: frecce che stringono le scapole */
    retraction: (
      <svg viewBox="0 0 120 90">
        <circle cx="60" cy="18" r="7" {...S} />
        <path d="M60 25 L60 60 M60 60 L50 84 M60 60 L70 84" {...S} />
        <path d="M60 30 L38 40 M60 30 L82 40" {...S} />
        <g>
          <path d="M40 48 L52 48 M48 44 L52 48 L48 52" {...S2} />
          <path d="M80 48 L68 48 M72 44 L68 48 L72 52" {...S2} />
          <animateTransform attributeName="transform" type="scale" values="1;0.86;1" dur="2.2s" repeatCount="indefinite" additive="sum" />
          <animateTransform attributeName="transform" type="translate" values="0 0; 8.4 6.7; 0 0" dur="2.2s" repeatCount="indefinite" additive="sum" />
        </g>
      </svg>
    ),
    /* dead bug: braccio e gamba opposti che si estendono */
    deadbug: (
      <svg viewBox="0 0 120 90">
        <line x1="10" y1="76" x2="110" y2="76" stroke={C.line} strokeWidth="4" strokeLinecap="round" />
        <circle cx="24" cy="66" r="7" {...S} />
        <path d="M31 68 L68 70" {...S} />
        <g>
          <path d="M40 66 L44 48" {...S2}>
            <animate attributeName="d" values="M40 66 L44 48; M40 66 L26 52; M40 66 L44 48" dur="3s" repeatCount="indefinite" />
          </path>
        </g>
        <path d="M68 70 L76 52 L92 52" {...S}>
          <animate attributeName="d" values="M68 70 L76 52 L92 52; M68 70 L88 58 L106 62; M68 70 L76 52 L92 52" dur="3s" repeatCount="indefinite" />
        </path>
      </svg>
    ),
    /* 90/90 hip: gambe a tergicristallo da seduta */
    hip9090: (
      <svg viewBox="0 0 120 90">
        <line x1="10" y1="78" x2="110" y2="78" stroke={C.line} strokeWidth="4" strokeLinecap="round" />
        <circle cx="46" cy="26" r="7" {...S} />
        <path d="M46 33 L46 62" {...S} />
        <g>
          <path d="M46 62 L72 66 L74 78 M46 62 L30 72 L18 70" {...S2} />
          <animateTransform attributeName="transform" type="rotate" values="0 46 62; 40 46 62; 0 46 62; -40 46 62; 0 46 62" dur="4.5s" repeatCount="indefinite" />
        </g>
      </svg>
    ),
    /* stretching psoas su box: affondo in ginocchio, oscillazione dolce */
    psoas: (
      <svg viewBox="0 0 120 90">
        <line x1="8" y1="80" x2="112" y2="80" stroke={C.line} strokeWidth="4" strokeLinecap="round" />
        <rect x="76" y="58" width="30" height="22" rx="3" fill={C.line} />
        <g>
          <circle cx="46" cy="20" r="7" {...S} />
          <path d="M47 27 L52 52" {...S} />
          <path d="M52 52 L78 50 L86 58" {...S2} />
          <path d="M52 52 L42 68 L30 80" {...S} />
          <animateTransform attributeName="transform" type="translate" values="0 0; 6 2; 0 0" dur="3.4s" repeatCount="indefinite" />
        </g>
      </svg>
    ),
    /* cat cow: colonna che si inarca su e giù */
    catcow: (
      <svg viewBox="0 0 120 90">
        <line x1="10" y1="80" x2="110" y2="80" stroke={C.line} strokeWidth="4" strokeLinecap="round" />
        <circle cx="26" cy="46" r="7" {...S}>
          <animate attributeName="cy" values="46;54;46;40;46" dur="4s" repeatCount="indefinite" />
        </circle>
        <path d="M33 50 Q 58 42 84 50" {...S2}>
          <animate attributeName="d" values="M33 50 Q 58 42 84 50; M33 52 Q 58 30 84 52; M33 50 Q 58 42 84 50; M33 48 Q 58 58 84 48; M33 50 Q 58 42 84 50" dur="4s" repeatCount="indefinite" />
        </path>
        <path d="M36 52 L36 80 M82 52 L82 80" {...S} />
      </svg>
    ),
    /* wall scapular row */
    wallRow: (
      <svg viewBox="0 0 120 90">
        <line x1="96" y1="8" x2="96" y2="84" stroke={C.line} strokeWidth="4" strokeLinecap="round" />
        <g>
          <circle cx="52" cy="22" r="7" {...S} />
          <path d="M55 29 L62 58 L58 84 M62 58 L70 84" {...S} />
          <path d="M58 36 L78 30 L92 24" {...S2}>
            <animate attributeName="d" values="M58 36 L78 30 L92 24; M58 36 L70 36 L92 24; M58 36 L78 30 L92 24" dur="2.4s" repeatCount="indefinite" />
          </path>
          <animateTransform attributeName="transform" type="translate" values="0 0; 8 -3; 0 0" dur="2.4s" repeatCount="indefinite" />
        </g>
      </svg>
    ),
    /* rematore busto flesso */
    row: (
      <svg viewBox="0 0 120 90">
        <line x1="10" y1="82" x2="110" y2="82" stroke={C.line} strokeWidth="4" strokeLinecap="round" />
        <circle cx="34" cy="34" r="7" {...S} />
        <path d="M40 38 L70 52 L66 82 M70 52 L82 82" {...S} />
        <path d="M46 42 L44 66" {...S2}>
          <animate attributeName="d" values="M46 42 L44 66; M46 42 L52 50; M46 42 L44 66" dur="2.2s" repeatCount="indefinite" />
        </path>
        <circle cx="44" cy="68" r="5" fill={C.rose} stroke="none">
          <animate attributeName="cy" values="68;52;68" dur="2.2s" repeatCount="indefinite" />
          <animate attributeName="cx" values="44;52;44" dur="2.2s" repeatCount="indefinite" />
        </circle>
      </svg>
    ),
    /* lento avanti manubrio singolo */
    press: (
      <svg viewBox="0 0 120 90">
        <line x1="10" y1="84" x2="110" y2="84" stroke={C.line} strokeWidth="4" strokeLinecap="round" />
        <circle cx="60" cy="34" r="7" {...S} />
        <path d="M60 41 L60 64 L52 84 M60 64 L68 84" {...S} />
        <path d="M60 46 L44 46" {...S} />
        <path d="M60 46 L76 40" {...S2}>
          <animate attributeName="d" values="M60 46 L76 40; M60 46 L70 16; M60 46 L76 40" dur="2.6s" repeatCount="indefinite" />
        </path>
        <circle cx="78" cy="38" r="5" fill={C.gold} stroke="none">
          <animate attributeName="cy" values="38;12;38" dur="2.6s" repeatCount="indefinite" />
          <animate attributeName="cx" values="78;70;78" dur="2.6s" repeatCount="indefinite" />
        </circle>
      </svg>
    ),
    /* single leg balance */
    balance: (
      <svg viewBox="0 0 120 90">
        <line x1="10" y1="84" x2="110" y2="84" stroke={C.line} strokeWidth="4" strokeLinecap="round" />
        <g>
          <circle cx="60" cy="18" r="7" {...S} />
          <path d="M60 25 L60 56 L60 84" {...S} />
          <path d="M60 56 L74 62 L72 76" {...S2} />
          <path d="M60 32 L44 40 M60 32 L76 40" {...S} />
          <animateTransform attributeName="transform" type="rotate" values="-2.5 60 84; 2.5 60 84; -2.5 60 84" dur="2.8s" repeatCount="indefinite" />
        </g>
      </svg>
    ),
    /* affondo posteriore */
    lunge: (
      <svg viewBox="0 0 120 90">
        <line x1="8" y1="84" x2="112" y2="84" stroke={C.line} strokeWidth="4" strokeLinecap="round" />
        <g>
          <circle cx="54" cy="16" r="7" {...S} />
          <path d="M54 23 L54 50" {...S} />
          <animateTransform attributeName="transform" type="translate" values="0 0; 0 10; 0 0" dur="2.8s" repeatCount="indefinite" />
        </g>
        <path d="M54 50 L46 66 L46 84" {...S2}>
          <animate attributeName="d" values="M54 50 L46 66 L46 84; M54 60 L44 74 L46 84; M54 50 L46 66 L46 84" dur="2.8s" repeatCount="indefinite" />
        </path>
        <path d="M54 50 L70 62 L86 78" {...S}>
          <animate attributeName="d" values="M54 50 L70 62 L86 78; M54 60 L74 72 L92 82; M54 50 L70 62 L86 78" dur="2.8s" repeatCount="indefinite" />
        </path>
      </svg>
    ),
    /* leg kick back in quadrupedia */
    kickback: (
      <svg viewBox="0 0 120 90">
        <line x1="8" y1="82" x2="112" y2="82" stroke={C.line} strokeWidth="4" strokeLinecap="round" />
        <circle cx="24" cy="42" r="7" {...S} />
        <path d="M31 46 L70 48" {...S} />
        <path d="M34 48 L34 82 M66 48 L66 82" {...S} />
        <path d="M70 48 L84 62 L86 80" {...S2}>
          <animate attributeName="d" values="M70 48 L84 62 L86 80; M70 48 L92 42 L108 40; M70 48 L84 62 L86 80" dur="2.6s" repeatCount="indefinite" />
        </path>
      </svg>
    ),
    /* sumo squat */
    sumo: (
      <svg viewBox="0 0 120 90">
        <line x1="8" y1="84" x2="112" y2="84" stroke={C.line} strokeWidth="4" strokeLinecap="round" />
        <g>
          <circle cx="60" cy="16" r="7" {...S} />
          <path d="M60 23 L60 46" {...S} />
          <path d="M60 30 L60 52" stroke="none" />
          <animateTransform attributeName="transform" type="translate" values="0 0; 0 14; 0 0" dur="3s" repeatCount="indefinite" />
        </g>
        <path d="M60 46 L36 62 L34 84 M60 46 L84 62 L86 84" {...S2}>
          <animate attributeName="d" values="M60 46 L36 62 L34 84 M60 46 L84 62 L86 84; M60 60 L34 70 L34 84 M60 60 L86 70 L86 84; M60 46 L36 62 L34 84 M60 46 L84 62 L86 84" dur="3s" repeatCount="indefinite" />
        </path>
      </svg>
    ),
    /* hip thrust */
    hipthrust: (
      <svg viewBox="0 0 120 90">
        <line x1="8" y1="84" x2="112" y2="84" stroke={C.line} strokeWidth="4" strokeLinecap="round" />
        <rect x="10" y="52" width="22" height="32" rx="3" fill={C.line} />
        <circle cx="22" cy="44" r="7" {...S} />
        <path d="M29 50 L58 58" {...S2}>
          <animate attributeName="d" values="M29 50 L58 58; M29 50 L58 46; M29 50 L58 58" dur="2.6s" repeatCount="indefinite" />
        </path>
        <path d="M58 58 L66 70 L66 84" {...S}>
          <animate attributeName="d" values="M58 58 L66 70 L66 84; M58 46 L68 66 L66 84; M58 58 L66 70 L66 84" dur="2.6s" repeatCount="indefinite" />
        </path>
        <circle cx="52" cy="48" r="5" fill={C.gold} stroke="none">
          <animate attributeName="cy" values="48;38;48" dur="2.6s" repeatCount="indefinite" />
        </circle>
      </svg>
    ),
    /* RDL manubri */
    rdl: (
      <svg viewBox="0 0 120 90">
        <line x1="8" y1="84" x2="112" y2="84" stroke={C.line} strokeWidth="4" strokeLinecap="round" />
        <path d="M60 50 L58 84" {...S} />
        <g>
          <circle cx="60" cy="20" r="7" {...S} />
          <path d="M60 27 L60 50" {...S} />
          <path d="M60 34 L58 56" {...S2} />
          <circle cx="58" cy="58" r="5" fill={C.gold} stroke="none" />
          <animateTransform attributeName="transform" type="rotate" values="0 60 50; -62 60 50; 0 60 50" dur="3s" repeatCount="indefinite" />
        </g>
      </svg>
    ),
    /* Y exercise */
    yraise: (
      <svg viewBox="0 0 120 90">
        <circle cx="60" cy="22" r="7" {...S} />
        <path d="M60 29 L60 62 L50 86 M60 62 L70 86" {...S} />
        <path d="M60 34 L42 44 M60 34 L78 44" {...S2}>
          <animate attributeName="d" values="M60 34 L42 44 M60 34 L78 44; M60 34 L40 14 M60 34 L80 14; M60 34 L42 44 M60 34 L78 44" dur="2.8s" repeatCount="indefinite" />
        </path>
      </svg>
    ),
    /* push up */
    pushup: (
      <svg viewBox="0 0 120 90">
        <line x1="8" y1="82" x2="112" y2="82" stroke={C.line} strokeWidth="4" strokeLinecap="round" />
        <g>
          <circle cx="24" cy="40" r="7" {...S} />
          <path d="M31 44 L72 54 L98 66 L108 82" {...S} />
          <animateTransform attributeName="transform" type="translate" values="0 0; 0 16; 0 0" dur="2.8s" repeatCount="indefinite" />
        </g>
        <path d="M36 48 L34 82" {...S2}>
          <animate attributeName="d" values="M36 48 L34 82; M36 64 L28 82; M36 48 L34 82" dur="2.8s" repeatCount="indefinite" />
        </path>
      </svg>
    ),
    /* plank in protrazione */
    plankProt: (
      <svg viewBox="0 0 120 90">
        <line x1="8" y1="82" x2="112" y2="82" stroke={C.line} strokeWidth="4" strokeLinecap="round" />
        <circle cx="26" cy="46" r="7" {...S}>
          <animate attributeName="cy" values="46;40;46" dur="2.4s" repeatCount="indefinite" />
        </circle>
        <path d="M33 50 Q 60 50 96 66 L110 82" {...S}>
          <animate attributeName="d" values="M33 50 Q 60 50 96 66 L110 82; M33 44 Q 60 44 96 62 L110 82; M33 50 Q 60 50 96 66 L110 82" dur="2.4s" repeatCount="indefinite" />
        </path>
        <path d="M38 52 L36 82" {...S2} />
      </svg>
    ),
    /* pullover con manubrio */
    pullover: (
      <svg viewBox="0 0 120 90">
        <line x1="8" y1="80" x2="112" y2="80" stroke={C.line} strokeWidth="4" strokeLinecap="round" />
        <circle cx="30" cy="66" r="7" {...S} />
        <path d="M37 68 L74 70 L86 56 L100 58" {...S} />
        <path d="M40 66 L40 42" {...S2}>
          <animate attributeName="d" values="M40 66 L40 42; M40 66 L18 56; M40 66 L40 42" dur="3s" repeatCount="indefinite" />
        </path>
        <circle cx="40" cy="40" r="5" fill={C.gold} stroke="none">
          <animate attributeName="cx" values="40;16;40" dur="3s" repeatCount="indefinite" />
          <animate attributeName="cy" values="40;54;40" dur="3s" repeatCount="indefinite" />
        </circle>
      </svg>
    ),
    /* alzate laterali al muro */
    latraise: (
      <svg viewBox="0 0 120 90">
        <line x1="20" y1="8" x2="20" y2="84" stroke={C.line} strokeWidth="4" strokeLinecap="round" />
        <circle cx="34" cy="20" r="7" {...S} />
        <path d="M34 27 L34 60 L28 86 M34 60 L42 86" {...S} />
        <path d="M34 34 L52 46" {...S2}>
          <animate attributeName="d" values="M34 34 L52 46; M34 34 L60 30; M34 34 L52 46" dur="2.4s" repeatCount="indefinite" />
        </path>
        <circle cx="54" cy="48" r="5" fill={C.gold} stroke="none">
          <animate attributeName="cx" values="54;62;54" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="cy" values="48;30;48" dur="2.4s" repeatCount="indefinite" />
        </circle>
      </svg>
    ),
    /* stretching gran dorsale */
    latStretch: (
      <svg viewBox="0 0 120 90">
        <line x1="8" y1="84" x2="112" y2="84" stroke={C.line} strokeWidth="4" strokeLinecap="round" />
        <g>
          <circle cx="60" cy="18" r="7" {...S} />
          <path d="M60 25 L60 58" {...S} />
          <path d="M60 30 L60 8" {...S2} />
          <animateTransform attributeName="transform" type="rotate" values="0 60 58; 22 60 58; 0 60 58" dur="3.6s" repeatCount="indefinite" />
        </g>
        <path d="M60 58 L50 84 M60 58 L70 84" {...S} />
      </svg>
    ),
  };
  return <div className="anim">{svgs[type] || svgs.breathe}</div>;
}

/* ---------------- DATI SCHEDE ---------------- */

const yt = (id) => `https://youtu.be/${id}`;

const SCHEDE = {
  posturale: {
    id: "posturale",
    nome: "Posturale",
    sub: "Mattina o sera · 4-5 volte a settimana",
    colore: C.green,
    target: [4, 5],
    sezioni: [
      {
        titolo: "Sequenza",
        esercizi: [
          { id: "p1", nome: "Respirazione diaframmatica 90/90", extra: "con feedback mani", serie: 2, reps: "8-10 per lato", anim: "breathe", video: yt("6-kEnoFzeTU") },
          { id: "p2", nome: "Serratus wall slide", serie: 2, reps: "6-8", anim: "wallslide", video: yt("Rg2E2m0P1Dc") },
          { id: "p3", nome: "Retrazioni scapolari", serie: 2, reps: "8-10", anim: "retraction", video: yt("Ep3klYm-g1U") },
          { id: "p4", nome: "Dead bug — progressione base", serie: 2, reps: "30-40″ tenuta", hold: 40, anim: "deadbug", video: yt("sW_1Q2ySzcI") },
          { id: "p5", nome: "90/90 hip mobility", serie: 2, reps: "8-10 per lato", anim: "hip9090", video: yt("hdbzAFXXP1A") },
          { id: "p6", nome: "Stretching psoas su box", serie: 2, reps: "30″ per lato", hold: 30, anim: "psoas", video: yt("Vcs4MbH7PO8") },
          { id: "p7", nome: "Respirazione toracica con cuscino", serie: 3, reps: "8-10 respiri profondi", anim: "breatheChest", video: yt("SxJ-hkzVSno") },
        ],
      },
    ],
  },
  giorno1: {
    id: "giorno1",
    nome: "Giorno 1",
    sub: "Blocco 1 · 1 volta a settimana",
    colore: C.rose,
    target: [1, 1],
    sezioni: [
      {
        titolo: "Warm up",
        esercizi: [
          { id: "g1w1", nome: "Cat cow", serie: 2, reps: "8-10 respiri profondi", anim: "catcow", video: yt("k_IMYWpLE64") },
          {
            gruppo: "Superset", rec: 45, esercizi: [
              { id: "g1w2", nome: "Serratus wall slide", serie: 2, reps: "6-8 respiri", anim: "wallslide", video: yt("Rg2E2m0P1Dc"), note: "Gomiti semi-flessi (come per un piegamento), scapole che si allontanano." },
              { id: "g1w3", nome: "Dead bug", serie: 2, reps: "40-60″ tenuta", hold: 60, anim: "deadbug", video: yt("_K6IHRiyyjI"), note: "Lombare a contatto col pavimento, «spingi» i pugni verso il soffitto, sguardo alto." },
            ],
          },
        ],
      },
      {
        titolo: "Blocco 1",
        esercizi: [
          {
            gruppo: "Superset", rec: 90, esercizi: [
              { id: "g1e1", nome: "Wall scapular row", serie: 3, reps: "6-8", anim: "wallRow", video: yt("S1QB6mu9gZ8") },
              { id: "g1e2", nome: "Rematore busto flesso", serie: 3, reps: "8-10", tut: "1″ iso", anim: "row", video: yt("s6P2-3g2mS0"), note: "Colonna neutra, glutei e addome attivi: pensa di tirare una gomitata verso le anche. Prima tutto il lato dx, poi sx." },
            ],
          },
          {
            id: "g1e3", nome: "Lento avanti manubrio singolo", serie: 2, reps: "8-12 per lato", tut: "3-1-1", rec: 60, anim: "press", video: yt("j3Gq-QPYoi4"),
            note: "Core attivo, colonna neutra: non spingere verso l'alto, segui le indicazioni del video.",
            prog: { 3: "2×8-10 lato (aumenta il peso)", 4: "3×8-10", 5: "3×10-12", 6: "3×10-12" },
          },
          {
            gruppo: "Superset", rec: 45, recNote: "tra le gambe", esercizi: [
              { id: "g1e4", nome: "Single leg balance + short foot attivo", serie: 3, reps: "40″ per lato", hold: 40, anim: "balance", video: yt("t3VtHQioL5U") },
              { id: "g1e5", nome: "Affondi posteriori con appoggio", serie: 3, reps: "8-10 per lato", tut: "3-1-1", anim: "lunge", video: yt("h1B3Gv3tza4") },
            ],
          },
          {
            id: "g1e6", nome: "Leg kick back in quadrupedia", serie: 2, reps: "12-15 per lato", tut: "2″ iso", rec: 30, recNote: "tra le gambe", anim: "kickback", video: yt("VDkMzWecAWw"),
            note: "Colonna neutra, movimento controllato (non inarcare la schiena); usa una cavigliera se disponibile.",
            prog: { 4: "3×15-20", 5: "3×20-25", 6: "2×20-25" },
          },
          { id: "g1e7", nome: "Stretching psoas su box", serie: 2, reps: "40-60″ per lato", hold: 60, anim: "psoas", video: yt("Vcs4MbH7PO8"), note: "Respira con il diaframma e rilassati." },
        ],
      },
    ],
  },
  giorno2: {
    id: "giorno2",
    nome: "Giorno 2",
    sub: "Blocco 1 · 1 volta a settimana",
    colore: C.gold,
    target: [1, 1],
    sezioni: [
      {
        titolo: "Warm up",
        esercizi: [
          { id: "g2w1", nome: "Cat cow", serie: 1, reps: "10-12", rec: 30, anim: "catcow", video: yt("k_IMYWpLE64") },
          { id: "g2w2", nome: "Dead bug", serie: 2, reps: "40″ tenuta", hold: 40, anim: "deadbug", video: yt("_K6IHRiyyjI"), note: "Associa la respirazione al movimento." },
        ],
      },
      {
        titolo: "Blocco 1",
        esercizi: [
          { id: "g2e1", nome: "Sumo squat", serie: 3, reps: "10-12", tut: "4-1-1", rec: 75, anim: "sumo", video: yt("ZEOEQrENraY") },
          { id: "g2e2", nome: "Hip thrust con palla", serie: 3, reps: "12-15", tut: "2″ iso", rec: 60, anim: "hipthrust", video: yt("-3m7utI9UX0"), note: "Manubrio se non hai il bilanciere; non stringere troppo la palla, attiva il core." },
          { id: "g2e3", nome: "RDL manubri", serie: 2, reps: "8-10", tut: "3-1-1", rec: 30, recNote: "tra le gambe", anim: "rdl", video: yt("7-07YwyEPf4"), note: "Ingaggia il gluteo prima di partire con il movimento." },
          {
            gruppo: "Superset", rec: 60, esercizi: [
              { id: "g2e4", nome: "Y exercise", serie: 2, reps: "8-10", anim: "yraise", video: yt("YdslKMTGMTY"), note: "Spalle lontane dalle orecchie: senti l'attivazione tra le scapole e zona lombare." },
              { id: "g2e5", nome: "Push up", serie: 2, reps: "MAX", tut: "3-1-1", anim: "pushup", video: yt("U2ZTXCC3NuY"), note: "Scapola che scorre sul torace, addome attivo: 5 ripetizioni lente sulle ginocchia + 3-5 sollevandole, senza perdere l'allineamento torace-bacino." },
            ],
          },
          {
            gruppo: "Triset", rec: 60, esercizi: [
              { id: "g2e6", nome: "Plank in protrazione", serie: 2, reps: "30″ tenuta", hold: 30, anim: "plankProt", video: yt("XetDEF4YDEo") },
              { id: "g2e7", nome: "Pullover con manubrio", serie: 2, reps: "8-10", tut: "3-1-1", anim: "pullover", video: yt("egBHWYaEWo4"), note: "Frena il movimento con l'addome, non inarcare la schiena. Associa la respirazione." },
              { id: "g2e8", nome: "Alzate laterali al muro", serie: 2, reps: "12-15", tut: "1″ iso", anim: "latraise", video: yt("Urvw3w2iftI") },
            ],
          },
          { id: "g2e9", nome: "Stretching gran dorsale", serie: 2, reps: "30-40″ per lato", hold: 40, anim: "latStretch", video: yt("t5r-dY9RyC8"), note: "Respira con il torace." },
        ],
      },
    ],
  },
};

const TIPI = [
  { id: "posturale", label: "Posturale", short: "P", colore: C.green },
  { id: "giorno1", label: "Giorno 1", short: "1", colore: C.rose },
  { id: "giorno2", label: "Giorno 2", short: "2", colore: C.gold },
];

/* ---------------- UTIL ---------------- */

const pad = (n) => String(n).padStart(2, "0");
const dateKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const MESI = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
const GIORNI = ["L", "M", "M", "G", "V", "S", "D"];

function startOfWeek(d) {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7; // lunedì = 0
  x.setDate(x.getDate() - day);
  x.setHours(0, 0, 0, 0);
  return x;
}

function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [0, 0.25, 0.5].forEach((t, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.value = i === 2 ? 1046 : 784;
      g.gain.setValueAtTime(0.001, ctx.currentTime + t);
      g.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.18);
      o.start(ctx.currentTime + t); o.stop(ctx.currentTime + t + 0.2);
    });
  } catch (e) { /* audio non disponibile */ }
}

/* ---------------- TIMER GLOBALE ---------------- */

function TimerSheet({ timer, onClose }) {
  const [left, setLeft] = useState(timer.sec);
  const [running, setRunning] = useState(true);
  const done = left <= 0;

  useEffect(() => { setLeft(timer.sec); setRunning(true); }, [timer]);

  useEffect(() => {
    if (!running || done) return;
    const t = setInterval(() => setLeft((l) => {
      if (l <= 1) { beep(); clearInterval(t); return 0; }
      return l - 1;
    }), 1000);
    return () => clearInterval(t);
  }, [running, done, timer]);

  const frac = timer.sec > 0 ? left / timer.sec : 0;
  const R = 52, CIRC = 2 * Math.PI * R;

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-label">{timer.label}</div>
        <div className="dial">
          <svg viewBox="0 0 120 120">
            <circle cx="60" cy="60" r={R} fill="none" stroke={C.line} strokeWidth="8" />
            <circle cx="60" cy="60" r={R} fill="none" stroke={done ? C.green : timer.colore || C.rose} strokeWidth="8"
              strokeLinecap="round" strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - frac)}
              transform="rotate(-90 60 60)" style={{ transition: "stroke-dashoffset 1s linear" }} />
          </svg>
          <div className="dial-num">{done ? "✓" : `${Math.floor(left / 60) > 0 ? Math.floor(left / 60) + ":" + pad(left % 60) : left}`}</div>
        </div>
        <div className="sheet-btns">
          {!done && <button className="btn ghost" onClick={() => setRunning((r) => !r)}>{running ? "Pausa" : "Riprendi"}</button>}
          <button className="btn ghost" onClick={() => { setLeft(timer.sec); setRunning(true); }}>Ricomincia</button>
          <button className="btn solid" onClick={onClose}>Chiudi</button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- CARD ESERCIZIO ---------------- */

function ExerciseCard({ ex, week, doneSets, onToggleSet, onTimer, colore, groupRec }) {
  const [reps, setReps] = useState(0);
  const [showNote, setShowNote] = useState(false);
  const progNow = ex.prog && ex.prog[week];
  const rec = ex.rec || groupRec;

  return (
    <div className="card">
      <div className="card-top">
        <Anim type={ex.anim} />
        <div className="card-info">
          <div className="card-name">{ex.nome}</div>
          {ex.extra && <div className="card-extra">{ex.extra}</div>}
          <div className="card-meta">
            <span className="pill" style={{ borderColor: colore, color: colore }}>{ex.serie}×{ex.reps}</span>
            {ex.tut && <span className="pill dim">TUT {ex.tut}</span>}
            {rec ? <span className="pill dim">rec {rec}″{ex.recNote ? ` ${ex.recNote}` : ""}</span> : null}
          </div>
          {progNow && <div className="prog">Settimana {week}: <b>{progNow}</b></div>}
        </div>
      </div>

      <div className="card-actions">
        <div className="sets">
          {Array.from({ length: ex.serie }).map((_, i) => (
            <button key={i} className={`set-dot ${doneSets > i ? "on" : ""}`}
              style={doneSets > i ? { background: colore, borderColor: colore } : {}}
              onClick={() => onToggleSet(ex.id, i)} aria-label={`Serie ${i + 1}`}>
              {i + 1}
            </button>
          ))}
        </div>
        <div className="spacer" />
        {ex.hold ? (
          <button className="mini-btn" onClick={() => onTimer({ sec: ex.hold, label: `${ex.nome} · tenuta`, colore })}>⏱ {ex.hold}″</button>
        ) : (
          <div className="counter">
            <button className="mini-btn" onClick={() => setReps((r) => Math.max(0, r - 1))}>−</button>
            <span className="counter-num">{reps}</span>
            <button className="mini-btn" onClick={() => setReps((r) => r + 1)}>+</button>
          </div>
        )}
        {rec ? <button className="mini-btn rec" onClick={() => onTimer({ sec: rec, label: "Recupero", colore })}>rec</button> : null}
        <a className="mini-btn video" href={ex.video} target="_blank" rel="noreferrer">▶ video</a>
        {ex.note && <button className="mini-btn" onClick={() => setShowNote((s) => !s)}>ⓘ</button>}
      </div>
      {showNote && ex.note && <div className="note">{ex.note}</div>}
    </div>
  );
}

/* ---------------- VISTA SCHEDA ---------------- */

function SchedaView({ scheda, onBack, onDone, onTimer }) {
  const [week, setWeek] = useState(1);
  const [sets, setSets] = useState({});

  const toggleSet = (exId, i) => {
    setSets((s) => {
      const cur = s[exId] || 0;
      return { ...s, [exId]: cur > i ? i : i + 1 };
    });
  };

  const allEx = scheda.sezioni.flatMap((sz) => sz.esercizi.flatMap((e) => (e.gruppo ? e.esercizi : [e])));
  const totalSets = allEx.reduce((a, e) => a + e.serie, 0);
  const doneTot = allEx.reduce((a, e) => a + Math.min(sets[e.id] || 0, e.serie), 0);
  const pct = Math.round((doneTot / totalSets) * 100);

  return (
    <div className="page">
      <div className="topbar">
        <button className="btn ghost" onClick={onBack}>← Schede</button>
        <div className="week-picker">
          <span>Sett.</span>
          {[1, 2, 3, 4, 5, 6].map((w) => (
            <button key={w} className={`wk ${week === w ? "on" : ""}`} style={week === w ? { background: scheda.colore, color: "#160B11" } : {}} onClick={() => setWeek(w)}>{w}</button>
          ))}
        </div>
      </div>

      <h1 className="title" style={{ color: scheda.colore }}>{scheda.nome}</h1>
      <div className="subtitle">{scheda.sub}</div>

      <div className="progressbar"><div style={{ width: `${pct}%`, background: scheda.colore }} /></div>
      <div className="progress-label">{doneTot}/{totalSets} serie completate</div>

      {scheda.sezioni.map((sz) => (
        <div key={sz.titolo}>
          <div className="section-title">{sz.titolo}</div>
          {sz.esercizi.map((e, i) =>
            e.gruppo ? (
              <div key={i} className="group">
                <div className="group-label">{e.gruppo} · rec {e.rec}″{e.recNote ? ` ${e.recNote}` : ""}</div>
                {e.esercizi.map((sub) => (
                  <ExerciseCard key={sub.id} ex={sub} week={week} doneSets={sets[sub.id] || 0}
                    onToggleSet={toggleSet} onTimer={onTimer} colore={scheda.colore} groupRec={e.rec} />
                ))}
              </div>
            ) : (
              <ExerciseCard key={e.id} ex={e} week={week} doneSets={sets[e.id] || 0}
                onToggleSet={toggleSet} onTimer={onTimer} colore={scheda.colore} />
            )
          )}
        </div>
      ))}

      <button className="btn big" style={{ background: scheda.colore }} onClick={() => onDone(scheda.id)}>
        ✓ Segna allenamento di oggi
      </button>
      <div style={{ height: 24 }} />
    </div>
  );
}

/* ---------------- CALENDARIO ---------------- */

function CalendarView({ log, onToggle }) {
  const today = new Date();
  const [ym, setYm] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const [sel, setSel] = useState(null);

  const first = new Date(ym.y, ym.m, 1);
  const offset = (first.getDay() + 6) % 7;
  const nDays = new Date(ym.y, ym.m + 1, 0).getDate();
  const cells = [...Array(offset).fill(null), ...Array.from({ length: nDays }, (_, i) => i + 1)];

  const move = (d) => {
    let m = ym.m + d, y = ym.y;
    if (m < 0) { m = 11; y--; } if (m > 11) { m = 0; y++; }
    setYm({ y, m }); setSel(null);
  };

  // conteggi mese
  const monthCounts = { posturale: 0, giorno1: 0, giorno2: 0 };
  Object.entries(log).forEach(([k, arr]) => {
    if (k.startsWith(`${ym.y}-${pad(ym.m + 1)}`)) arr.forEach((t) => { if (monthCounts[t] !== undefined) monthCounts[t]++; });
  });

  return (
    <div className="page">
      <div className="cal-head">
        <button className="btn ghost" onClick={() => move(-1)}>‹</button>
        <div className="cal-month">{MESI[ym.m]} {ym.y}</div>
        <button className="btn ghost" onClick={() => move(1)}>›</button>
      </div>

      <div className="cal-grid">
        {GIORNI.map((g, i) => <div key={i} className="cal-dow">{g}</div>)}
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const k = `${ym.y}-${pad(ym.m + 1)}-${pad(d)}`;
          const entries = log[k] || [];
          const isToday = k === dateKey(today);
          return (
            <button key={i} className={`cal-day ${isToday ? "today" : ""} ${sel === k ? "sel" : ""}`} onClick={() => setSel(sel === k ? null : k)}>
              <span>{d}</span>
              <div className="dots">
                {entries.map((t, j) => {
                  const tipo = TIPI.find((x) => x.id === t);
                  return <span key={j} className="dot" style={{ background: tipo?.colore }} />;
                })}
              </div>
            </button>
          );
        })}
      </div>

      {sel && (
        <div className="day-editor">
          <div className="day-editor-title">{sel.split("-").reverse().join("/")}</div>
          <div className="chip-row">
            {TIPI.map((t) => {
              const on = (log[sel] || []).includes(t.id);
              return (
                <button key={t.id} className={`chip ${on ? "on" : ""}`}
                  style={on ? { background: t.colore, borderColor: t.colore, color: "#160B11" } : { borderColor: t.colore, color: t.colore }}
                  onClick={() => onToggle(sel, t.id)}>
                  {on ? "✓ " : "+ "}{t.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="month-summary">
        <div className="section-title">Questo mese</div>
        {TIPI.map((t) => (
          <div key={t.id} className="sum-row">
            <span className="dot" style={{ background: t.colore }} />
            <span>{t.label}</span>
            <span className="sum-n">{monthCounts[t.id]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- HOME ---------------- */

function Home({ log, onOpen }) {
  const today = new Date();
  const ws = startOfWeek(today);
  const weekCounts = { posturale: 0, giorno1: 0, giorno2: 0 };
  for (let i = 0; i < 7; i++) {
    const d = new Date(ws); d.setDate(ws.getDate() + i);
    (log[dateKey(d)] || []).forEach((t) => { if (weekCounts[t] !== undefined) weekCounts[t]++; });
  }

  return (
    <div className="page">
      <div className="hero">
        <div className="hero-eyebrow">Il tuo percorso è unico</div>
        <h1 className="hero-title">Ciao, Elena</h1>
        <div className="hero-week">
          {Array.from({ length: 7 }).map((_, i) => {
            const d = new Date(ws); d.setDate(ws.getDate() + i);
            const entries = log[dateKey(d)] || [];
            const isToday = dateKey(d) === dateKey(today);
            return (
              <div key={i} className={`hero-day ${isToday ? "today" : ""}`}>
                <span className="hero-dow">{GIORNI[i]}</span>
                <span className="hero-num">{d.getDate()}</span>
                <div className="dots">
                  {entries.map((t, j) => <span key={j} className="dot" style={{ background: TIPI.find((x) => x.id === t)?.colore }} />)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {Object.values(SCHEDE).map((s) => {
        const done = weekCounts[s.id];
        const [min, max] = s.target;
        const ok = done >= min;
        return (
          <button key={s.id} className="scheda-card" onClick={() => onOpen(s.id)}>
            <div className="scheda-stripe" style={{ background: s.colore }} />
            <div className="scheda-body">
              <div className="scheda-name">{s.nome}</div>
              <div className="scheda-sub">{s.sub}</div>
              <div className="scheda-track">
                {Array.from({ length: max }).map((_, i) => (
                  <span key={i} className="track-dot" style={{
                    background: i < done ? s.colore : "transparent",
                    borderColor: i < min ? s.colore : C.dim,
                    borderStyle: i < min ? "solid" : "dashed",
                  }} />
                ))}
                <span className="track-label" style={{ color: ok ? s.colore : C.dim }}>
                  {done}/{min === max ? min : `${min}-${max}`} questa settimana{ok ? " ✓" : ""}
                </span>
              </div>
            </div>
            <div className="scheda-arrow">›</div>
          </button>
        );
      })}
    </div>
  );
}

/* ---------------- APP ---------------- */

export default function App() {
  const [view, setView] = useState("home"); // home | scheda | calendario
  const [schedaId, setSchedaId] = useState(null);
  const [log, setLog] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [timer, setTimer] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("workout-log");
      if (raw) setLog(JSON.parse(raw));
    } catch (e) { /* nessun log salvato */ }
    setLoaded(true);
  }, []);

  const saveLog = (next) => {
    setLog(next);
    try { localStorage.setItem("workout-log", JSON.stringify(next)); }
    catch (e) { console.error("salvataggio non riuscito", e); }
  };

  const toggleDay = (key, tipo) => {
    const cur = log[key] || [];
    const next = { ...log, [key]: cur.includes(tipo) ? cur.filter((t) => t !== tipo) : [...cur, tipo] };
    if (next[key].length === 0) delete next[key];
    saveLog(next);
  };

  const markToday = (tipo) => {
    const k = dateKey(new Date());
    const cur = log[k] || [];
    if (!cur.includes(tipo)) saveLog({ ...log, [k]: [...cur, tipo] });
    setToast(`${SCHEDE[tipo].nome} segnato per oggi ✓`);
    setTimeout(() => setToast(null), 2500);
    setView("home");
  };

  return (
    <div className="app">
      <style>{CSS}</style>

      {view === "home" && loaded && <Home log={log} onOpen={(id) => { setSchedaId(id); setView("scheda"); }} />}
      {view === "scheda" && schedaId && (
        <SchedaView scheda={SCHEDE[schedaId]} onBack={() => setView("home")} onDone={markToday} onTimer={setTimer} />
      )}
      {view === "calendario" && <CalendarView log={log} onToggle={toggleDay} />}

      {timer && <TimerSheet timer={timer} onClose={() => setTimer(null)} />}
      {toast && <div className="toast">{toast}</div>}

      <nav className="tabbar">
        <button className={view === "home" || view === "scheda" ? "on" : ""} onClick={() => setView("home")}>
          <span className="tab-ico">▦</span>Allenamenti
        </button>
        <button className={view === "calendario" ? "on" : ""} onClick={() => setView("calendario")}>
          <span className="tab-ico">☷</span>Calendario
        </button>
      </nav>
    </div>
  );
}

/* ---------------- STILE ---------------- */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@600;800&family=Outfit:wght@400;500;600;700&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }
.app {
  min-height: 100vh; background: ${C.bg}; color: ${C.cream};
  font-family: 'Outfit', system-ui, sans-serif;
  max-width: 560px; margin: 0 auto; padding-bottom: 84px;
}
.page { padding: 20px 18px 8px; }

/* hero */
.hero { margin-bottom: 22px; }
.hero-eyebrow { font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: ${C.rose}; margin-bottom: 6px; }
.hero-title { font-family: 'Unbounded', sans-serif; font-weight: 800; font-size: 26px; margin-bottom: 16px; }
.hero-week { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; }
.hero-day { background: ${C.surface}; border-radius: 12px; padding: 8px 2px 6px; text-align: center; border: 1px solid transparent; }
.hero-day.today { border-color: ${C.rose}; }
.hero-dow { display: block; font-size: 10px; color: ${C.dim}; }
.hero-num { display: block; font-size: 14px; font-weight: 600; margin: 2px 0 4px; }
.dots { display: flex; gap: 3px; justify-content: center; min-height: 6px; flex-wrap: wrap; }
.dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; }

/* schede in home */
.scheda-card {
  width: 100%; display: flex; align-items: stretch; gap: 0; background: ${C.surface};
  border: 1px solid ${C.line}; border-radius: 16px; margin-bottom: 12px; cursor: pointer;
  text-align: left; color: inherit; font: inherit; overflow: hidden; padding: 0;
  transition: transform .12s ease, border-color .12s ease;
}
.scheda-card:hover { transform: translateY(-1px); border-color: ${C.wine}; }
.scheda-stripe { width: 6px; flex: none; }
.scheda-body { padding: 14px 14px 12px; flex: 1; }
.scheda-name { font-family: 'Unbounded', sans-serif; font-weight: 600; font-size: 16px; margin-bottom: 2px; }
.scheda-sub { font-size: 12.5px; color: ${C.dim}; margin-bottom: 10px; }
.scheda-track { display: flex; align-items: center; gap: 6px; }
.track-dot { width: 12px; height: 12px; border-radius: 50%; border: 2px solid; display: inline-block; }
.track-label { font-size: 12px; margin-left: 4px; }
.scheda-arrow { align-self: center; padding: 0 14px; color: ${C.dim}; font-size: 22px; }

/* scheda view */
.topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; gap: 8px; flex-wrap: wrap; }
.title { font-family: 'Unbounded', sans-serif; font-size: 24px; font-weight: 800; }
.subtitle { color: ${C.dim}; font-size: 13px; margin: 4px 0 14px; }
.week-picker { display: flex; align-items: center; gap: 4px; font-size: 12px; color: ${C.dim}; }
.wk { width: 26px; height: 26px; border-radius: 8px; border: 1px solid ${C.line}; background: ${C.surface}; color: ${C.cream}; cursor: pointer; font-weight: 600; }
.progressbar { height: 6px; background: ${C.surface2}; border-radius: 3px; overflow: hidden; }
.progressbar > div { height: 100%; border-radius: 3px; transition: width .3s ease; }
.progress-label { font-size: 12px; color: ${C.dim}; margin: 6px 0 18px; }
.section-title { font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: ${C.rose}; margin: 18px 0 10px; }
.group { border-left: 2px solid ${C.wine}; padding-left: 10px; margin-bottom: 14px; }
.group-label { font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: ${C.gold}; margin-bottom: 8px; font-weight: 600; }

/* card esercizio */
.card { background: ${C.surface}; border: 1px solid ${C.line}; border-radius: 16px; padding: 12px; margin-bottom: 12px; }
.card-top { display: flex; gap: 12px; }
.anim { width: 96px; height: 72px; flex: none; background: ${C.surface2}; border-radius: 12px; padding: 4px; }
.anim svg { width: 100%; height: 100%; }
.card-info { flex: 1; min-width: 0; }
.card-name { font-weight: 700; font-size: 15px; line-height: 1.25; }
.card-extra { font-size: 12px; color: ${C.dim}; }
.card-meta { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 6px; }
.pill { font-size: 11.5px; border: 1px solid ${C.line}; border-radius: 99px; padding: 2px 9px; font-weight: 600; }
.pill.dim { color: ${C.dim}; }
.prog { font-size: 12px; color: ${C.gold}; margin-top: 6px; }
.card-actions { display: flex; align-items: center; gap: 8px; margin-top: 10px; flex-wrap: wrap; }
.sets { display: flex; gap: 6px; }
.set-dot { width: 30px; height: 30px; border-radius: 50%; border: 2px solid ${C.line}; background: transparent; color: ${C.dim}; font-weight: 700; font-size: 12px; cursor: pointer; }
.set-dot.on { color: #160B11; }
.spacer { flex: 1; }
.counter { display: flex; align-items: center; gap: 6px; }
.counter-num { min-width: 24px; text-align: center; font-weight: 700; font-variant-numeric: tabular-nums; }
.mini-btn { border: 1px solid ${C.line}; background: ${C.surface2}; color: ${C.cream}; border-radius: 10px; padding: 6px 10px; font-size: 12.5px; font-weight: 600; cursor: pointer; text-decoration: none; font-family: inherit; }
.mini-btn.video { color: ${C.rose}; border-color: ${C.wine}; }
.mini-btn.rec { color: ${C.gold}; }
.note { margin-top: 10px; font-size: 13px; color: ${C.roseSoft}; background: ${C.surface2}; border-radius: 10px; padding: 10px 12px; line-height: 1.45; }

/* bottoni */
.btn { border: none; border-radius: 12px; padding: 9px 14px; font-weight: 600; cursor: pointer; font-family: inherit; font-size: 14px; }
.btn.ghost { background: ${C.surface}; color: ${C.cream}; border: 1px solid ${C.line}; }
.btn.solid { background: ${C.rose}; color: #160B11; }
.btn.big { width: 100%; padding: 15px; font-size: 15px; color: #160B11; font-family: 'Unbounded', sans-serif; font-weight: 600; margin-top: 8px; border-radius: 14px; }

/* timer sheet */
.sheet-backdrop { position: fixed; inset: 0; background: rgba(10,4,8,.72); display: flex; align-items: flex-end; justify-content: center; z-index: 50; }
.sheet { background: ${C.surface}; border: 1px solid ${C.line}; border-radius: 22px 22px 0 0; padding: 22px 20px 28px; width: 100%; max-width: 560px; text-align: center; }
.sheet-label { font-size: 13px; color: ${C.dim}; margin-bottom: 12px; }
.dial { position: relative; width: 170px; height: 170px; margin: 0 auto 14px; }
.dial svg { width: 100%; height: 100%; }
.dial-num { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-family: 'Unbounded', sans-serif; font-size: 34px; font-weight: 800; }
.sheet-btns { display: flex; gap: 8px; justify-content: center; }

/* calendario */
.cal-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
.cal-month { font-family: 'Unbounded', sans-serif; font-weight: 600; font-size: 17px; }
.cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 5px; }
.cal-dow { text-align: center; font-size: 11px; color: ${C.dim}; padding-bottom: 4px; }
.cal-day { aspect-ratio: 1; background: ${C.surface}; border: 1px solid transparent; border-radius: 10px; color: ${C.cream}; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; font-size: 13px; font-family: inherit; }
.cal-day.today { border-color: ${C.rose}; }
.cal-day.sel { background: ${C.surface2}; border-color: ${C.roseSoft}; }
.day-editor { background: ${C.surface}; border: 1px solid ${C.line}; border-radius: 14px; padding: 14px; margin-top: 14px; }
.day-editor-title { font-weight: 700; margin-bottom: 10px; }
.chip-row { display: flex; gap: 8px; flex-wrap: wrap; }
.chip { border: 1.5px solid; background: transparent; border-radius: 99px; padding: 7px 13px; font-weight: 600; font-size: 13px; cursor: pointer; font-family: inherit; }
.month-summary { margin-top: 20px; }
.sum-row { display: flex; align-items: center; gap: 10px; padding: 8px 4px; border-bottom: 1px solid ${C.line}; font-size: 14px; }
.sum-row .dot { width: 9px; height: 9px; }
.sum-n { margin-left: auto; font-weight: 700; font-variant-numeric: tabular-nums; }

/* tab bar */
.tabbar { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 560px; display: flex; background: rgba(22,11,17,.94); backdrop-filter: blur(8px); border-top: 1px solid ${C.line}; z-index: 40; }
.tabbar button { flex: 1; background: none; border: none; color: ${C.dim}; padding: 11px 0 13px; font-family: inherit; font-size: 12px; font-weight: 600; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 2px; }
.tabbar button.on { color: ${C.rose}; }
.tab-ico { font-size: 17px; }

/* toast */
.toast { position: fixed; bottom: 68px; left: 50%; transform: translateX(-50%); background: ${C.green}; color: #160B11; font-weight: 700; padding: 10px 18px; border-radius: 99px; z-index: 60; font-size: 14px; box-shadow: 0 6px 24px rgba(0,0,0,.4); }

@media (prefers-reduced-motion: reduce) {
  .anim svg * { animation: none; }
}
`;
