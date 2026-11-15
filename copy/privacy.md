# Tayli Privacy Policy

**Draft: not legal advice, and not yet reviewed by counsel.**
Version 0.4 draft, 2026-11-14. Published by the Tayli project.

## 1. The short version
- Tayli runs on your Mac. **The Tayli project receives none of your data.** We have no server, no account, no analytics and no telemetry. Downloading from GitHub or visiting our website is covered by their policies.
- What leaves your Mac goes only to services **you** set up: Anthropic (through your own Claude Code account), the websites Tayli opens, Discord if you use it, safety lookup services as described in section 3, and anything a background task you start contacts.
- You can see, edit and delete what Tayli stores. Deleting the Tayli data folder deletes it, except copies in your own backups (section 2).

## 2. What is stored on your Mac
All in Tayli's data folder unless noted. **Voiceprints, voice clips, recordings, chat history, memories and other sensitive data are encrypted on disk by Tayli with a key kept in your macOS Keychain**. Your macOS account password and FileVault add protection. Time Machine, iCloud or other backups you run may copy this folder, including voiceprints; deleting in Tayli does not delete those copies.

| Data | What it is | Kept for | Control |
|---|---|---|---|
| Chat history and transcripts | Text of what was said to and by Tayli, including speech not addressed to Tayli that the microphone heard while running. Transcripts are text, not voiceprints. | 90 days, then deleted automatically, or sooner if you delete | View, delete in app |
| Memories | Facts, notes on people, places, routines, preferences Tayli saved | Until deleted | Visible, editable, deletable |
| Your voiceprint | A numeric model of your voice, used to tell your voice from others | Until you delete it or turn the setting off, and deleted automatically after 1 year unused | Created only after you accept the voiceprint step |
| Others' voiceprints | Same, for people who said yes when asked, plus a short voice clip per name so you can check and correct it | Temporary at first; kept longer for people met often; least-used removed under a size cap; deleted on request; at most 1 year unused | Setting "Allow others' voiceprints", off by default; always off in Illinois; delete per person |
| Recordings | Audio and logs of calls and sessions, while recording is on (the default), used on your Mac for transcripts, debugging, testing and improving Tayli. Separate from voiceprints. | Kept within a 2 GB total; oldest deleted first when the cap is reached | Setting, delete in app |
| Browser profile | Cookies, sign-ins, saved site data and history of Tayli's automated browser | Until deleted | Clear in app |
| Task files and logs | Output of background coding tasks and app logs; logs may contain transcript text, page content or anything a task printed | 90 days, then deleted automatically | Delete folder |
| Settings | Your choices, confirmation you are 18+, record of which terms version you accepted and when | Until deleted | Settings |

Background coding tasks can read and change any file your macOS user can, in the folders you give them. Tayli uses the macOS permissions you grant it (at least the microphone).

## 3. What leaves your Mac
| To | What | When | Their policy |
|---|---|---|---|
| Anthropic, via your Claude Code account | Your requests, conversation context, relevant memories, recent overheard lines (sent as context when you say Tayli's name, including other people's words), tool results, web page content, contents of files a task reads | Each time Tayli thinks or acts | Anthropic's terms and privacy policy for your account type. Your account settings decide training use and retention, not us. Text only; no audio or voiceprints. |
| Websites (through Tayli's browser or the optional browser integration) | What a browser normally sends: your IP address, cookies, what Tayli types and clicks | When browser features are on and Tayli opens a page | Each site's policy |
| Safety lookups, Standard (default) | Tayli downloads hashed lists and checks pages on your Mac. If a page matches a list entry, a short hash prefix may be sent to confirm it | Lists refresh in the background | Provider's policy |
| Safety lookups, Enhanced (opt-in) | Full web addresses Tayli is about to open, sent to services such as Google Safe Browsing, VirusTotal or URLhaus | Before opening a page | Provider's policy; these services may keep or share what they receive (VirusTotal shares submissions with security partners) |
| Optional browser integration (browsertrail, third-party) | Whatever its own privacy policy describes; Tayli does not control it | If you install and turn it on | Its own terms and privacy policy, accepted separately |
| Discord | Tayli's voice and what it says; Tayli hears the call and transcribes it | When you bring Tayli into a Discord call | Discord's policy |
| Whatever a background task contacts | For example package registries or sites a task fetches | When a task you started runs | Each service's policy |
| Speech engines | None: speech-to-text, text-to-speech and voice ID run on your Mac | | |

Voiceprints and voice clips never leave your Mac through Tayli. Your own backups are outside Tayli's control (section 2).

## 4. Microphone and transcription
While Tayli is visibly running, its microphone is on (or push-to-talk, per your setting) and speech is transcribed on your Mac, including people nearby who are not talking to Tayli. Overheard lines stay on your Mac and are not sent each turn; when you say Tayli's name, recent ones may be sent to Anthropic as context. Declining a voiceprint declines only storing the voiceprint, not transcription. Tell people nearby that Tayli is listening, and pause or quit it where people expect privacy.

Wake word and voice detection are not always reliable. Tayli may wake and start listening or answering when nobody said her name (similar-sounding words such as "Taylor" count as her name on purpose; a TV or other people can trigger her), and may miss her name, even with voice recognition (voiceprint) on. Whatever she hears while awake is transcribed as described above. Limitations: false wakes, missed wakes, mishearings and transcription errors, voice recognition mistaking people, echo (she may hear herself), and transcription of nearby speech while she listens. Tell other people in the room that Tayli listens and get their consent; if they do not consent, use push to talk or Mute. Liability is covered by section 11 of the Terms.

## 5. Voiceprints and biometric laws
A voiceprint is biometric data under several laws. Transcripts are not: they record what was said, not a model of the voice. Tayli's practice:
- **Consent first.** Tayli asks a new person aloud ("Nice to meet you, is it OK if I remember your voice?") and stores their voiceprint only on a clear yes. A no stops the voiceprint only. Your own voiceprint needs your acceptance of the in-app voiceprint step.
- **Purpose.** Only to recognise who is speaking. Never sold, leased, traded, shared or profited from; never sent off your Mac by Tayli.
- **Retention.** Deleted when the purpose ends, on request, when the size cap evicts it, or after 1 year without use, whichever is first. This paragraph is the published retention and destruction schedule.
- **Security.** Encrypted on disk with a key held in your macOS Keychain.
- **Illinois (BIPA, 740 ILCS 14).** Requires informed written consent (a "written release") before collecting a biometric identifier, plus a public retention and destruction policy; private right of action with statutory damages. A spoken yes is very likely not a written release. Tayli therefore turns other people's voiceprints off for Illinois users; your own voiceprint uses the written (on-screen tick-box) consent in the app.
- **Texas (CUBI, Bus. & Com. Code 503.001).** Inform and get consent before capture for a commercial purpose; no sale; destroy within a reasonable time, no later than a year after the purpose ends; enforced by the Attorney General.
- **Washington (RCW 19.375 and My Health My Data Act, RCW 19.373).** Notice and consent before enrolling a biometric identifier for a commercial purpose; MHMDA covers biometric data and is enforceable privately through the Consumer Protection Act.
- Also relevant: Colorado (biometric amendment to its privacy act), California (CCPA/CPRA sensitive personal information), New York City (biometric notice, for commercial establishments), EU/UK GDPR (biometric data for identification is special-category data).
Tayli follows the consent pattern anyway.
Tayli is for adults only. Never store a child's voiceprint; if a child says yes, delete it.

## 6. Recording calls and consent laws
Recording is on by default, saved only on this Mac, and you can turn it off in Settings. It is separate from voiceprints. Before you record, follow the law of every place a caller is in.
- **All-party consent** (everyone must agree), as commonly listed: California, Delaware, Florida, Illinois, Maryland, Massachusetts, Michigan (disputed), Montana, Nevada (phone calls), New Hampshire, Oregon (in-person conversations), Pennsylvania, Washington; Connecticut (civil liability).
- **One-party consent**: US federal law and most other states. When callers are in different places, follow the strictest.
- Outside the US rules differ (e.g. EU/UK data protection, Canada). Discord's terms also apply.
Tayli does not announce recording aloud unless you turn on Announce recording in Settings. You alone are responsible for telling people and getting the consent the law requires before you record, whether or not the announcement is on.

## 7. Children
Tayli is for adults (18+) only. The project collects nothing from anyone, so holds no children's data.

## 8. Your rights and choices
Because the Tayli project holds none of your data, you access, correct or delete it yourself, in the app or by deleting the data folder. For data held by Anthropic, a website, Discord, a safety service or an optional integration, contact them; we are not responsible for third parties or for telling you when their policies change. We do not sell or share personal information. We believe we are not a controller or business for data that stays on your Mac, but this is not settled.

## 9. Security
Tayli's safety measures: approval cards for risky actions, a safety reviewer for risky pages and actions, site safety lists, and limits on background tasks. Sensitive stored data is encrypted with a Keychain-held key (section 2); your Mac's security (password, FileVault, updates) adds protection. No system is perfectly secure.

## 10. Changes
We try our best to announce changes in the app, website and GitHub. You are responsible for checking. Changed versions apply once you accept them in the app.

## 11. Contact
The Tayli project's GitHub repository (Issues). Do not post personal data in a public issue.
