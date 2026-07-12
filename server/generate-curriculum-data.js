const fs = require('fs');
const path = require('path');

const curriculum = [
  // WEEK 1: Days 0 - 6
  {
    day_number: 0,
    dsa_topic: "Orientation — Big O Notation",
    dsa_tasks: [
      "Watch intro to time/space complexity",
      "Write out Big O for 5 sample code snippets by hand",
      "Understand O(1) vs O(n) vs O(log n) vs O(n²) with examples"
    ],
    dsa_resource: "takeUforward 'Time and Space Complexity' video (YouTube)",
    cyber_topic: "Orientation — How the Internet Works",
    cyber_tasks: [
      "Watch NetworkChuck 'How does the Internet work' video",
      "Learn what an IP address and DNS is in your own words",
      "Write 5-line summary in your notes"
    ],
    cyber_resource: "NetworkChuck YouTube + TryHackMe 'Pre Security' intro room"
  },
  {
    day_number: 1,
    dsa_topic: "Arrays — Traversal & Basics",
    dsa_tasks: [
      "Solve: Two Sum on LeetCode",
      "Solve: Best Time to Buy and Sell Stock on LeetCode",
      "Solve: Contains Duplicate on LeetCode",
      "Understand two-pointer technique conceptually"
    ],
    dsa_resource: "LeetCode Easy Array problems + takeUforward Array playlist Ep 1–3",
    cyber_topic: "Networking Deep Dive — TCP/IP Model",
    cyber_tasks: [
      "Learn the 4 layers of TCP/IP model",
      "Understand difference between TCP and UDP",
      "Complete TryHackMe 'Pre Security' - Networking room"
    ],
    cyber_resource: "TryHackMe Pre Security path"
  },
  {
    day_number: 2,
    dsa_topic: "Arrays — Rotation & Prefix Sums",
    dsa_tasks: [
      "Solve: Rotate Array on LeetCode",
      "Solve: Product of Array Except Self on LeetCode",
      "Solve: Find Pivot Index on LeetCode"
    ],
    dsa_resource: "takeUforward Array playlist Ep 4–6",
    cyber_topic: "Linux Fundamentals I",
    cyber_tasks: [
      "Install/access a Kali Linux VM via VirtualBox",
      "Learn basic navigation: ls, cd, pwd, mkdir",
      "Learn file permission basics: chmod, chown"
    ],
    cyber_resource: "TryHackMe 'Linux Fundamentals Part 1'"
  },
  {
    day_number: 3,
    dsa_topic: "Two Pointer Technique",
    dsa_tasks: [
      "Solve: Valid Palindrome on LeetCode",
      "Solve: Container With Most Water on LeetCode",
      "Solve: 3Sum on LeetCode"
    ],
    dsa_resource: "NeetCode Two Pointers playlist",
    cyber_topic: "Linux Fundamentals II",
    cyber_tasks: [
      "Learn piping and redirection: |, >, >>",
      "Learn grep, find, cat, less basics",
      "Complete TryHackMe 'Linux Fundamentals Part 2'"
    ],
    cyber_resource: "TryHackMe Linux Fundamentals path"
  },
  {
    day_number: 4,
    dsa_topic: "Strings — Manipulation Basics",
    dsa_tasks: [
      "Solve: Valid Anagram on LeetCode",
      "Solve: Longest Common Prefix on LeetCode",
      "Solve: Reverse String on LeetCode"
    ],
    dsa_resource: "takeUforward String playlist Ep 1–2",
    cyber_topic: "HTTP/HTTPS & Web Basics",
    cyber_tasks: [
      "Learn how HTTP requests/responses work",
      "Understand GET vs POST methods",
      "Use browser DevTools to inspect a real request"
    ],
    cyber_resource: "TryHackMe 'Intro to Cyber Security' — Web fundamentals room"
  },
  {
    day_number: 5,
    dsa_topic: "Recursion Basics",
    dsa_tasks: [
      "Solve: Factorial (recursive)",
      "Solve: Fibonacci (recursive)",
      "Solve: Sum of Digits (recursive)",
      "Understand recursion tree / call stack visually"
    ],
    dsa_resource: "takeUforward Recursion playlist Ep 1–3",
    cyber_topic: "DNS & Domains Deep Dive",
    cyber_tasks: [
      "Learn how DNS resolution works step by step",
      "Use nslookup and dig commands to query real domains",
      "Note down what A, MX, CNAME records mean"
    ],
    cyber_resource: "TryHackMe Pre Security — DNS room"
  },
  {
    day_number: 6,
    dsa_topic: "Recursion — Basic Backtracking Intro",
    dsa_tasks: [
      "Solve: Power Set (Subsets)",
      "Solve: Generate Parentheses",
      "Understand backtracking template pattern"
    ],
    dsa_resource: "NeetCode Backtracking intro video",
    cyber_topic: "Review Day + Light CTF",
    cyber_tasks: [
      "Review week's networking and Linux notes",
      "Attempt 2 PicoCTF 'General Skills' beginner challenges",
      "Summarize the TCP/IP layers from memory"
    ],
    cyber_resource: "PicoCTF"
  },

  // WEEK 2: Days 7 - 13
  {
    day_number: 7,
    dsa_topic: "Weekly Check-in Day 1",
    dsa_tasks: [
      "Solve 3 mixed problems from Days 1–6 topics without notes",
      "Review recursion call stack conceptual errors",
      "Re-solve the 3Sum problem under 20 minutes"
    ],
    dsa_resource: "Self-Test / LeetCode",
    cyber_topic: "Weekly Check-in Day 1 - Cyber",
    cyber_tasks: [
      "Complete TryHackMe Pre Security path fully if not done",
      "Write a 5-bullet summary of everything learned this week",
      "Review your saved answers for Linux Fundamentals"
    ],
    cyber_resource: "Self-Review / TryHackMe"
  },
  {
    day_number: 8,
    dsa_topic: "Sorting Algorithms I",
    dsa_tasks: [
      "Understand & implement Bubble Sort by hand",
      "Understand & implement Selection Sort by hand",
      "Understand & implement Insertion Sort by hand"
    ],
    dsa_resource: "takeUforward Sorting playlist Ep 1–3",
    cyber_topic: "PicoCTF — General Skills Category",
    cyber_tasks: [
      "Complete all 'General Skills' challenges on PicoCTF",
      "Document your approach for each in a notes doc",
      "Understand standard CTF flag formats and submission"
    ],
    cyber_resource: "PicoCTF"
  },
  {
    day_number: 9,
    dsa_topic: "Sorting Algorithms II",
    dsa_tasks: [
      "Understand & implement Merge Sort",
      "Understand & implement Quick Sort",
      "Solve: Sort Colors problem on LeetCode"
    ],
    dsa_resource: "takeUforward Sorting playlist Ep 4–6",
    cyber_topic: "PicoCTF — Web Exploitation Sampling",
    cyber_tasks: [
      "Attempt 3 beginner Web Exploitation challenges",
      "Examine cookie manipulation in browser cookies",
      "Note reaction: did you enjoy this category? rate 1–5"
    ],
    cyber_resource: "PicoCTF Web category"
  },
  {
    day_number: 10,
    dsa_topic: "Binary Search I",
    dsa_tasks: [
      "Solve: Binary Search (basic) on LeetCode",
      "Solve: Search Insert Position on LeetCode",
      "Understand the invariant / template for binary search"
    ],
    dsa_resource: "takeUforward Binary Search playlist Ep 1–2",
    cyber_topic: "PicoCTF — Cryptography Sampling",
    cyber_tasks: [
      "Attempt 3 beginner Cryptography challenges",
      "Understand ROT13 and basic Caesar cipher decryptions",
      "Note reaction: rate 1–5"
    ],
    cyber_resource: "PicoCTF Crypto category"
  },
  {
    day_number: 11,
    dsa_topic: "Binary Search II — Variations",
    dsa_tasks: [
      "Solve: Search in Rotated Sorted Array on LeetCode",
      "Solve: Find First and Last Position of Element on LeetCode",
      "Solve: Find Minimum in Rotated Sorted Array on LeetCode"
    ],
    dsa_resource: "takeUforward Binary Search playlist Ep 3–5",
    cyber_topic: "PicoCTF — Forensics Sampling",
    cyber_tasks: [
      "Attempt 3 beginner Forensics challenges",
      "Inspect image file metadata using exiftool",
      "Note reaction: rate 1–5"
    ],
    cyber_resource: "PicoCTF Forensics category"
  },
  {
    day_number: 12,
    dsa_topic: "Binary Search on Answer",
    dsa_tasks: [
      "Solve: Koko Eating Bananas on LeetCode",
      "Understand the 'binary search on answer space' pattern conceptually",
      "Solve: Capacity To Ship Packages Within D Days on LeetCode"
    ],
    dsa_resource: "NeetCode video on Binary Search on Answer",
    cyber_topic: "PicoCTF — Reverse Engineering Sampling",
    cyber_tasks: [
      "Attempt 2 beginner RE challenges",
      "Learn what strings and file commands do in Linux",
      "Note reaction: rate 1–5"
    ],
    cyber_resource: "PicoCTF Reverse Engineering category"
  },
  {
    day_number: 13,
    dsa_topic: "Mixed Review — Week 2",
    dsa_tasks: [
      "Solve 5 mixed medium problems timed (25 min each)",
      "Review sorting algorithm space and time complexity comparisons",
      "Implement binary search iteratively and recursively from scratch"
    ],
    dsa_resource: "LeetCode custom mixed set",
    cyber_topic: "PicoCTF — OSINT + Pwn Sampling",
    cyber_tasks: [
      "Attempt 2 OSINT challenges",
      "Attempt 1–2 beginner Pwn/binary exploitation challenges",
      "Note reaction to both: rate 1–5"
    ],
    cyber_resource: "PicoCTF OSINT + Binary Exploitation categories"
  },

  // WEEK 3: Days 14 - 20
  {
    day_number: 14,
    dsa_topic: "Weekly Check-in Day 2",
    dsa_tasks: [
      "Solve 3 problems from Week 2 topics cold",
      "Document performance and review times for binary search questions",
      "Revise Merge Sort partition recurrence relation"
    ],
    dsa_resource: "Self-Test / LeetCode",
    cyber_topic: "Weekly Check-in Day 2 - Cyber",
    cyber_tasks: [
      "Look back at all category ratings from Days 8–13 (Web, Crypto, Forensics, RE, OSINT, Pwn)",
      "Write down your top 2 favorite categories — this will guide Days 61+ domain deep-dive",
      "Ensure all PicoCTF write-ups are organized in your notes"
    ],
    cyber_resource: "Self-Review / Notes"
  },
  {
    day_number: 15,
    dsa_topic: "Strings — Advanced Traversal",
    dsa_tasks: [
      "Solve: Longest Palindromic Substring",
      "Solve: Group Anagrams (string key hashing)",
      "Understand time complexity of string slicing operations"
    ],
    dsa_resource: "takeUforward String playlist Ep 3-4",
    cyber_topic: "PicoCTF — Binary Exploitation Focus",
    cyber_tasks: [
      "Complete 'buffer overflow 0' challenge",
      "Learn how memory stack grows and overwrites local variables",
      "Write brief description of buffer overflow remediation"
    ],
    cyber_resource: "PicoCTF Binary Exploitation"
  },
  {
    day_number: 16,
    dsa_topic: "Recursion — Advanced Patterns",
    dsa_tasks: [
      "Solve: Subset Sums (GFG/LeetCode variant)",
      "Solve: Combination Sum (Backtracking recurse)",
      "Map out the recursion tree for Combination Sum by hand"
    ],
    dsa_resource: "takeUforward Recursion playlist Ep 4-6",
    cyber_topic: "PicoCTF — Web Exploitation Focus",
    cyber_tasks: [
      "Complete 'Insp3ct0r' and 'where are the cookies' challenges",
      "Inspect source HTML, JS, and CSS files for hidden flags",
      "Understand cookie flags like Secure, HttpOnly, and SameSite"
    ],
    cyber_resource: "PicoCTF Web Exploitation"
  },
  {
    day_number: 17,
    dsa_topic: "Backtracking — Advanced Combinations",
    dsa_tasks: [
      "Solve: Combination Sum II (handle duplicate elements)",
      "Solve: Permutations (swap-based backtrack)",
      "Implement subsets extraction using bit masking"
    ],
    dsa_resource: "NeetCode Backtracking playlist",
    cyber_topic: "PicoCTF — Forensics Focus",
    cyber_tasks: [
      "Complete 'Glory of the Garden' and 'extensions' challenges",
      "Use hexedit or xxd to examine binary signatures (Magic Bytes)",
      "Repair a corrupt file header manually to retrieve a hidden image"
    ],
    cyber_resource: "PicoCTF Forensics"
  },
  {
    day_number: 18,
    dsa_topic: "Arrays & Hashing — Advanced Traversal",
    dsa_tasks: [
      "Solve: Longest Consecutive Sequence",
      "Solve: Subarray Sum Equals K (prefix sum + hashmap)",
      "Identify the O(N) optimization using a hashset"
    ],
    dsa_resource: "takeUforward Array playlist Ep 7-9",
    cyber_topic: "PicoCTF — Reverse Engineering Focus",
    cyber_tasks: [
      "Complete 'transformation' and 'keygenme-py' (beginner)",
      "Decompile simple python keygen scripts",
      "Understand basic instruction sets (disassembly concepts)"
    ],
    cyber_resource: "PicoCTF Reverse Engineering"
  },
  {
    day_number: 19,
    dsa_topic: "Strings — Pattern Matching",
    dsa_tasks: [
      "Solve: Find the Index of the First Occurrence in a String",
      "Understand Rabin-Karp hashing technique conceptually",
      "Compare KMP matcher with naive matching time complexities"
    ],
    dsa_resource: "takeUforward String playlist Ep 5",
    cyber_topic: "PicoCTF — Cryptography Focus",
    cyber_tasks: [
      "Complete 'mod 26' and '13' ciphers",
      "Implement a ROT13 decoder program in Python",
      "Understand XOR cipher operations and their properties"
    ],
    cyber_resource: "PicoCTF Cryptography"
  },
  {
    day_number: 20,
    dsa_topic: "Hashing — Basic Frequency Counting",
    dsa_tasks: [
      "Solve: Top K Frequent Elements",
      "Solve: Frequency of the Most Frequent Element",
      "Understand collision resolution strategies in hashmaps"
    ],
    dsa_resource: "NeetCode Hashing playlist",
    cyber_topic: "PicoCTF — OSINT Focus",
    cyber_tasks: [
      "Complete 'information' or similar OSINT challenge",
      "Perform reverse image searches using search engines",
      "Read metadata of PDF and DOCX attachments to find authors"
    ],
    cyber_resource: "PicoCTF OSINT"
  },

  // WEEK 4: Days 21 - 27
  {
    day_number: 21,
    dsa_topic: "Weekly Check-in Day 3",
    dsa_tasks: [
      "Solve 3 mixed problems on Recursion and Hashing",
      "Document time complexities of Rabin-Karp vs KMP",
      "Implement a simple hash map with chaining on paper"
    ],
    dsa_resource: "Self-Test / LeetCode",
    cyber_topic: "Weekly Check-in Day 3 - Cyber",
    cyber_tasks: [
      "Review CTF writeups and compile final flag submissions",
      "Organize notes on Reverse Engineering binary formats",
      "Read introductory material for CompTIA Security+"
    ],
    cyber_resource: "Self-Review / Security+ Guide"
  },
  {
    day_number: 22,
    dsa_topic: "Linked Lists — Singly Representation",
    dsa_tasks: [
      "Implement a basic Node class and Singly Linked List class",
      "Solve: Insert a Node at the Tail / Head on LeetCode/GFG",
      "Trace LL traversal pointers in debugger"
    ],
    dsa_resource: "takeUforward Linked List playlist Ep 1-2",
    cyber_topic: "Security+ Ports and Protocols",
    cyber_tasks: [
      "Memorize common ports: 22 (SSH), 80 (HTTP), 443 (HTTPS), 53 (DNS), 21 (FTP), 23 (Telnet)",
      "Learn ports: 25 (SMTP), 110 (POP3), 143 (IMAP), 3389 (RDP), 161 (SNMP), 389 (LDAP)",
      "Create flashcards (Anki) for all these ports and quiz yourself"
    ],
    cyber_resource: "Professor Messer Security+ SY0-701 playlist"
  },
  {
    day_number: 23,
    dsa_topic: "Linked Lists — Deletion & Search",
    dsa_tasks: [
      "Solve: Delete Node in a Linked List",
      "Solve: Remove Nth Node From End of List",
      "Understand the edge cases of deleting the head node"
    ],
    dsa_resource: "takeUforward Linked List playlist Ep 3-4",
    cyber_topic: "Security+ Network Devices & Infrastructure",
    cyber_tasks: [
      "Learn differences between Hubs, Switches, Routers, and Firewalls",
      "Understand what a Load Balancer does and its security implications",
      "Define Intrusion Detection System (IDS) vs Intrusion Prevention System (IPS)"
    ],
    cyber_resource: "Professor Messer Security+ video section on Network Hardware"
  },
  {
    day_number: 24,
    dsa_topic: "Linked Lists — Reversing a Linked List",
    dsa_tasks: [
      "Solve: Reverse Linked List (Iterative)",
      "Solve: Reverse Linked List (Recursive)",
      "Draw the pointer swaps step-by-step on paper"
    ],
    dsa_resource: "takeUforward Linked List playlist Ep 5",
    cyber_topic: "Security+ Network Attack Types",
    cyber_tasks: [
      "Define Denial of Service (DoS) and Distributed DoS (DDoS)",
      "Understand Man-in-the-Middle (MitM), ARP Poisoning, and DNS Spoofing",
      "Learn what MAC flooding is and how switches handle it"
    ],
    cyber_resource: "Professor Messer Security+ videos on Network Attacks"
  },
  {
    day_number: 25,
    dsa_topic: "Linked Lists — Cycle Detection",
    dsa_tasks: [
      "Solve: Linked List Cycle (Floyd's Tortoise and Hare algorithm)",
      "Solve: Linked List Cycle II (Find the cycle start node)",
      "Prove why fast and slow pointers must meet if a cycle exists"
    ],
    dsa_resource: "takeUforward Linked List playlist Ep 6-7",
    cyber_topic: "Security+ Wireless Security",
    cyber_tasks: [
      "Understand differences between WEP, WPA, WPA2, and WPA3 encryption",
      "Learn about Pre-Shared Key (PSK) vs Enterprise authentication modes",
      "Understand Rogue APs and Evil Twin attacks"
    ],
    cyber_resource: "Professor Messer Security+ wireless security videos"
  },
  {
    day_number: 26,
    dsa_topic: "Linked Lists — Doubly Linked Lists",
    dsa_tasks: [
      "Implement a Doubly Linked List Node with prev and next",
      "Solve: Reverse a Doubly Linked List",
      "Understand benefits and overheads of DLLs compared to singly LLs"
    ],
    dsa_resource: "takeUforward Linked List playlist Ep 8-9",
    cyber_topic: "Security+ Secure Network Design",
    cyber_tasks: [
      "Define DMZ (Demilitarized Zone) and screen subnets",
      "Understand Network Address Translation (NAT) and Port Address Translation (PAT)",
      "Explain VLAN segmentation and Network Access Control (NAC)"
    ],
    cyber_resource: "Professor Messer Security+ network design videos"
  },
  {
    day_number: 27,
    dsa_topic: "Linked Lists — Merge Lists",
    dsa_tasks: [
      "Solve: Merge Two Sorted Lists",
      "Solve: Palindrome Linked List",
      "Understand in-place merging vs extra space merging"
    ],
    dsa_resource: "takeUforward Linked List playlist Ep 10",
    cyber_topic: "Security+ Network Defense Tools",
    cyber_tasks: [
      "Learn what packet analyzers (Wireshark) are used for",
      "Understand Network Scanners (Nmap) and Vulnerability Scanners",
      "Differentiate between HIDS/HIPS and NIDS/NIPS"
    ],
    cyber_resource: "Professor Messer Security+ tools videos"
  },

  // WEEK 5: Days 28 - 34
  {
    day_number: 28,
    dsa_topic: "Weekly Check-in Day 4",
    dsa_tasks: [
      "Solve 3 mixed Linked List problems (one singly, one doubly, one cycle)",
      "Review recursive reverse linked list implementation details",
      "Write a short essay on circular linked list applications"
    ],
    dsa_resource: "Self-Test / LeetCode",
    cyber_topic: "Weekly Check-in Day 4 - Cyber",
    cyber_tasks: [
      "Review port flashcards and test memory of top 15 ports",
      "Outline a secure network architecture layout incorporating a DMZ and WAF",
      "Write a 1-page summary of wireless security improvements (WPA2 vs WPA3)"
    ],
    cyber_resource: "Self-Review / Security+ Study Guide"
  },
  {
    day_number: 29,
    dsa_topic: "Stacks — Implementation",
    dsa_tasks: [
      "Implement Stack using Arrays",
      "Implement Stack using Linked Lists",
      "Verify LIFO (Last-In-First-Out) properties and write down time complexities"
    ],
    dsa_resource: "takeUforward Stacks & Queues playlist Ep 1-2",
    cyber_topic: "Security+ Symmetric Cryptography",
    cyber_tasks: [
      "Define Symmetric Encryption basics (shared key)",
      "Learn algorithms: DES, 3DES, AES (128, 192, 256 bits), Blowfish, Twofish",
      "Differentiate block ciphers from stream ciphers (RC4, ChaCha)"
    ],
    cyber_resource: "Professor Messer Security+ Cryptography section"
  },
  {
    day_number: 30,
    dsa_topic: "Queues — Implementation",
    dsa_tasks: [
      "Implement Queue using Arrays",
      "Implement Queue using Linked Lists",
      "Verify FIFO (First-In-First-Out) properties and write down time complexities"
    ],
    dsa_resource: "takeUforward Stacks & Queues playlist Ep 3-4",
    cyber_topic: "Security+ Asymmetric Cryptography",
    cyber_tasks: [
      "Define Asymmetric Encryption (Public and Private Keys)",
      "Learn algorithms: RSA, Diffie-Hellman (DH), Elliptic Curve Cryptography (ECC)",
      "Explain how key exchange works using Diffie-Hellman conceptually"
    ],
    cyber_resource: "Professor Messer Security+ Cryptography section"
  },
  {
    day_number: 31,
    dsa_topic: "Stacks — Valid Parentheses",
    dsa_tasks: [
      "Solve: Valid Parentheses on LeetCode",
      "Understand why stack is optimal for nested structure validation",
      "Walk through the dry run of '(([]))' showing stack status"
    ],
    dsa_resource: "takeUforward Stacks & Queues playlist Ep 5",
    cyber_topic: "Security+ Hashing & Digital Signatures",
    cyber_tasks: [
      "Understand hashing (MD5, SHA-1, SHA-2, SHA-3) and integrity",
      "Learn what a salt is and how it prevents rainbow table attacks",
      "Explain how digital signatures provide authenticity and non-repudiation"
    ],
    cyber_resource: "Professor Messer Security+ Cryptography section"
  },
  {
    day_number: 32,
    dsa_topic: "Stacks — Min Stack",
    dsa_tasks: [
      "Solve: Min Stack (getMin in O(1) time)",
      "Implement with two stacks",
      "Implement with single stack using value encoding formulas"
    ],
    dsa_resource: "takeUforward Stacks & Queues playlist Ep 6",
    cyber_topic: "Security+ Public Key Infrastructure (PKI)",
    cyber_tasks: [
      "Learn the roles of Certificate Authority (CA) and Registration Authority (RA)",
      "Understand Certificate Revocation Lists (CRLs) and Online Certificate Status Protocol (OCSP)",
      "Differentiate between certificate formats: PEM, DER, PFX, CER"
    ],
    cyber_resource: "Professor Messer Security+ PKI videos"
  },
  {
    day_number: 33,
    dsa_topic: "Queues — Cross Implementations",
    dsa_tasks: [
      "Solve: Implement Queue using Stacks",
      "Solve: Implement Stack using Queues",
      "Analyze the amortized time complexity of push and pop in both"
    ],
    dsa_resource: "takeUforward Stacks & Queues playlist Ep 7-8",
    cyber_topic: "Security+ Cryptographic Attacks",
    cyber_tasks: [
      "Define Birthday Attacks, Replay Attacks, and Downgrade Attacks",
      "Understand Known Plaintext Attacks (KPA) and Ciphertext-Only Attacks",
      "Explain why key stretching algorithms (PBKDF2, bcrypt) prevent brute forcing"
    ],
    cyber_resource: "Professor Messer Security+ Cryptographic Attacks videos"
  },
  {
    day_number: 34,
    dsa_topic: "Monotonic Stack — Next Greater Element",
    dsa_tasks: [
      "Solve: Next Greater Element I on LeetCode",
      "Solve: Next Greater Element II (Circular array version)",
      "Understand monotonic stack property: items sorted inside stack"
    ],
    dsa_resource: "takeUforward Stacks & Queues playlist Ep 9-10",
    cyber_topic: "Security+ Secure Protocols",
    cyber_tasks: [
      "Define secure protocols: SSH (22), SFTP (22), HTTPS (443), LDAPS (636)",
      "Differentiate SSL vs TLS (TLS 1.2 and TLS 1.3 features)",
      "Understand S/MIME, PGP, and SRTP protocol security"
    ],
    cyber_resource: "Professor Messer Security+ Protocols videos"
  },

  // WEEK 6: Days 35 - 41
  {
    day_number: 35,
    dsa_topic: "Weekly Check-in Day 5",
    dsa_tasks: [
      "Solve 3 mixed Stack/Queue problems under time limit",
      "Dry run Next Greater Element on [4, 5, 2, 10, 8]",
      "Implement a queue using a circular array"
    ],
    dsa_resource: "Self-Test / LeetCode",
    cyber_topic: "Weekly Check-in Day 5 - Cyber",
    cyber_tasks: [
      "Summarize the differences between PKI components",
      "Draft a comparison table of Symmetric vs Asymmetric algorithms",
      "Explain how a Digital Signature is verified step-by-step"
    ],
    cyber_resource: "Self-Review / Security+ Guide"
  },
  {
    day_number: 36,
    dsa_topic: "Hash Maps — Scratch Design",
    dsa_tasks: [
      "Solve: Design HashMap (without built-in library functions)",
      "Implement linear probing and chaining methods of collision resolution",
      "Analyze average vs worst case hash map time complexities"
    ],
    dsa_resource: "takeUforward Hashing playlist Ep 1-2",
    cyber_topic: "Security+ Governance and Policies",
    cyber_tasks: [
      "Learn standard policies: AUP (Acceptable Use Policy), NDA, Service Level Agreement (SLA)",
      "Understand Personnel management: Job Rotation, Mandatory Vacations, Separation of Duties",
      "Differentiate between Standards, Policies, Guidelines, and Procedures"
    ],
    cyber_resource: "Professor Messer Security+ Governance videos"
  },
  {
    day_number: 37,
    dsa_topic: "Hash Maps — Two Sum & Variants",
    dsa_tasks: [
      "Solve: Two Sum (using Hash Map for O(N) complexity)",
      "Solve: 4Sum on LeetCode",
      "Analyze trade-offs between sorting + two-pointer vs hash map solutions"
    ],
    dsa_resource: "takeUforward Array playlist Ep 10-11",
    cyber_topic: "Security+ Risk Management Frameworks",
    cyber_tasks: [
      "Understand Risk Assessments: Quantitative (SLE, ARO, ALE) vs Qualitative",
      "Define Risk Responses: Mitigate, Transfer, Accept, Avoid",
      "Differentiate between RTO (Recovery Time Objective) and RPO (Recovery Point Objective)"
    ],
    cyber_resource: "Professor Messer Security+ Risk Management videos"
  },
  {
    day_number: 38,
    dsa_topic: "Hash Sets — Longest Consecutive Sequence",
    dsa_tasks: [
      "Solve: Longest Consecutive Sequence on LeetCode",
      "Understand how to query boundary values in O(1) using Hash Set",
      "Ensure space and time complexities are strictly O(N)"
    ],
    dsa_resource: "NeetCode Hashing playlist",
    cyber_topic: "Security+ Privacy and Sensitive Data",
    cyber_tasks: [
      "Define PII (Personally Identifiable Information) and PHI (Protected Health Information)",
      "Understand Roles: Data Owner, Data Controller, Data Processor, Data Custodian",
      "Learn data destruction methods: declassification, sanitization, degaussing, shredding"
    ],
    cyber_resource: "Professor Messer Security+ Privacy videos"
  },
  {
    day_number: 39,
    dsa_topic: "Hash Maps — Group Anagrams",
    dsa_tasks: [
      "Solve: Group Anagrams on LeetCode",
      "Solve: Find All Anagrams in a String on LeetCode",
      "Design a custom hash key based on character frequency arrays"
    ],
    dsa_resource: "takeUforward String playlist Ep 6",
    cyber_topic: "Security+ Business Continuity & DR",
    cyber_tasks: [
      "Learn what Business Impact Analysis (BIA) is used for",
      "Understand redundancy: RAID levels (0, 1, 5, 10) and backup configurations",
      "Differentiate Hot Sites, Warm Sites, and Cold Sites for disaster recovery"
    ],
    cyber_resource: "Professor Messer Security+ Continuity videos"
  },
  {
    day_number: 40,
    dsa_topic: "Hash Maps — Subarray Sum Equals K",
    dsa_tasks: [
      "Solve: Subarray Sum Equals K",
      "Solve: Subarray Sums Divisible by K",
      "Draw how prefix sums help resolve subarray checks in linear time"
    ],
    dsa_resource: "takeUforward Array playlist Ep 12",
    cyber_topic: "Security+ Security Controls & Compliance",
    cyber_tasks: [
      "Define Technical, Administrative, and Physical controls",
      "Define Preventive, Detective, Corrective, Deterrent, and Compensating controls",
      "Briefly research GDPR, HIPAA, and PCI-DSS compliance frameworks"
    ],
    cyber_resource: "Professor Messer Security+ Controls videos"
  },
  {
    day_number: 41,
    dsa_topic: "Hash Sets — Subarray with 0 Sum",
    dsa_tasks: [
      "Solve: Subarray with 0 Sum (GFG/LeetCode variant)",
      "Solve: Longest Subarray with sum divisible by K",
      "Contrast hash set lookup speed with array indices iteration"
    ],
    dsa_resource: "LeetCode Hash Map tags",
    cyber_topic: "Security+ Vulnerability & Threat Intelligence",
    cyber_tasks: [
      "Differentiate Vulnerability Scanning vs Penetration Testing",
      "Learn about CVSS (Common Vulnerability Scoring System) metrics",
      "Define Threat Feeds, OSINT feeds, and ISACs (Information Sharing and Analysis Centers)"
    ],
    cyber_resource: "Professor Messer Security+ Vuln videos"
  },

  // WEEK 7: Days 42 - 48
  {
    day_number: 42,
    dsa_topic: "Weekly Check-in Day 6",
    dsa_tasks: [
      "Solve 3 mixed Hashmap/Hashset problems",
      "Refactor Subarray Sum Equals K to optimize memory",
      "List hash collision resolution strategies and write-ups"
    ],
    dsa_resource: "Self-Test / LeetCode",
    cyber_topic: "Weekly Check-in Day 6 - Cyber",
    cyber_tasks: [
      "Complete flashcard checks on all Security Controls",
      "Perform a mock quantitative risk calculation (ALE = SLE * ARO)",
      "Draw up a DR site comparison chart (Hot vs Warm vs Cold)"
    ],
    cyber_resource: "Self-Review / Security+ Guide"
  },
  {
    day_number: 43,
    dsa_topic: "Backtracking — Permutations I",
    dsa_tasks: [
      "Solve: Permutations I on LeetCode (without duplicates)",
      "Solve: Permutations II (handling duplicates)",
      "Compare time complexity differences: O(N * N!) vs O(N!)"
    ],
    dsa_resource: "takeUforward Recursion playlist Ep 7-8",
    cyber_topic: "Security+ Threat Actors & Vectors",
    cyber_tasks: [
      "Define Nation-State, Hacktivist, Script Kiddie, Insider Threat, Organized Crime",
      "Understand Threat Vectors: Email, Social Media, Direct Access, Wireless, Supply Chain",
      "Learn about OSINT research for identifying threat actor campaigns"
    ],
    cyber_resource: "Professor Messer Security+ Threat Actors videos"
  },
  {
    day_number: 44,
    dsa_topic: "Backtracking — Combination Sum I",
    dsa_tasks: [
      "Solve: Combination Sum I (unlimited usage of numbers)",
      "Solve: Combination Sum II (each number used once, handle duplicates)",
      "Construct recursion trees showing base cases and branches"
    ],
    dsa_resource: "takeUforward Recursion playlist Ep 9-10",
    cyber_topic: "Security+ IAM (Identity & Access Management)",
    cyber_tasks: [
      "Learn Authentication: MFA factors (Something you know, have, are, do, somewhere you are)",
      "Understand Authorization Models: DAC (Discretionary), MAC (Mandatory), RBAC (Role-Based), ABAC (Attribute-Based)",
      "Define SSO (Single Sign-On), SAML, OAuth, and OIDC conceptually"
    ],
    cyber_resource: "Professor Messer Security+ Identity videos"
  },
  {
    day_number: 45,
    dsa_topic: "Backtracking — Subsets II",
    dsa_tasks: [
      "Solve: Subsets II (handle duplicate values in input array)",
      "Solve: Letter Combinations of a Phone Number on LeetCode",
      "Analyze tree branching factor and max depth calculations"
    ],
    dsa_resource: "NeetCode Backtracking playlist",
    cyber_topic: "Security+ Physical & Host Security",
    cyber_tasks: [
      "Review physical controls: Mantrap, Faraday Cage, Bollards, Biometrics, Hot/Cold Aisles",
      "Differentiate Host Security: Endpoint Detection & Response (EDR), Antivirus, HIPS, Host Firewall",
      "Understand Hardening techniques: disabling unused services, default passwords, port security"
    ],
    cyber_resource: "Professor Messer Security+ Host Security videos"
  },
  {
    day_number: 46,
    dsa_topic: "Backtracking — Word Search",
    dsa_tasks: [
      "Solve: Word Search on LeetCode (Matrix + DFS backtracking)",
      "Optimize search by checking character counts beforehand",
      "Trace visited cells back and restore state on recursion return"
    ],
    dsa_resource: "takeUforward Recursion playlist Ep 11",
    cyber_topic: "Security+ Incident Response & Forensics",
    cyber_tasks: [
      "Differentiate Incident Response Phases: Preparation, Detection, Containment, Eradication, Recovery, Lessons Learned",
      "Understand Order of Volatility in forensics (CPU Cache -> RAM -> Swap/Temp -> Disk -> Backups)",
      "Learn about Chain of Custody and write a template chain of custody form"
    ],
    cyber_resource: "Professor Messer Security+ Forensics videos"
  },
  {
    day_number: 47,
    dsa_topic: "Backtracking — N-Queens",
    dsa_tasks: [
      "Solve: N-Queens (find all distinct board configurations)",
      "Optimize board check using array markers for rows, diagonals, and anti-diagonals",
      "Explain back-tracking pruning conceptually"
    ],
    dsa_resource: "takeUforward Recursion playlist Ep 12",
    cyber_topic: "Security+ Full Practice Exam 1",
    cyber_tasks: [
      "Take a timed, 90-question CompTIA Security+ practice exam",
      "Grade the exam and record your final percentage",
      "Identify the top 3 weak areas to study tomorrow"
    ],
    cyber_resource: "Professor Messer / ExamCompass free practice test"
  },
  {
    day_number: 48,
    dsa_topic: "Backtracking — Palindrome Partitioning",
    dsa_tasks: [
      "Solve: Palindrome Partitioning on LeetCode",
      "Combine backtracking with palindrome checking helper",
      "Analyze recursion depth and efficiency of precomputing palindromes"
    ],
    dsa_resource: "takeUforward Recursion playlist Ep 13",
    cyber_topic: "Security+ Practice Exam Review",
    cyber_tasks: [
      "Review every wrong answer from yesterday's practice test",
      "Write detailed notes explaining the correct concepts for those questions",
      "Re-quiz yourself on ports, cryptography types, and security controls"
    ],
    cyber_resource: "Self-Review / Security+ Guide"
  },

  // WEEK 8: Days 49 - 55
  {
    day_number: 49,
    dsa_topic: "Weekly Check-in Day 7",
    dsa_tasks: [
      "Solve 3 mixed Backtracking problems timed",
      "Compare N-Queens iterative vs backtracking runtimes",
      "Outline standard backtracking algorithm templates"
    ],
    dsa_resource: "Self-Test / LeetCode",
    cyber_topic: "Weekly Check-in Day 7 - Cyber",
    cyber_tasks: [
      "Review Security+ exam scoring metrics",
      "Summarize the incident response phases from memory",
      "Plan your upcoming pentesting practice labs"
    ],
    cyber_resource: "Self-Review / Study Plan"
  },
  {
    day_number: 50,
    dsa_topic: "Mixed Review — Array & String Mediums",
    dsa_tasks: [
      "Solve: String to Integer (atoi) on LeetCode",
      "Solve: 3Sum Closest on LeetCode",
      "Optimize array storage and bounds handling"
    ],
    dsa_resource: "LeetCode Mediums tag",
    cyber_topic: "Pentesting Methodology",
    cyber_tasks: [
      "Learn the stages of penetration testing: Reconnaissance, Scanning, Gaining Access, Maintaining Access, Covering Tracks",
      "Understand Rules of Engagement (RoE) and scope boundaries",
      "Differentiate Black Box, Grey Box, and White Box assessments"
    ],
    cyber_resource: "TryHackMe 'Intro to Pentesting' room"
  },
  {
    day_number: 51,
    dsa_topic: "Mixed Review — LL & Hashing Mediums",
    dsa_tasks: [
      "Solve: Add Two Numbers (Linked Lists representation)",
      "Solve: Continuous Subarray Sum on LeetCode",
      "Verify edge cases like carrying overflow and empty lists"
    ],
    dsa_resource: "LeetCode Mediums tag",
    cyber_topic: "Passive Reconnaissance & OSINT",
    cyber_tasks: [
      "Learn how to perform passive recon using whois and DNS queries",
      "Use search engine advanced syntax (Google Dorks) to find exposed config files",
      "Explore shodan.io to locate vulnerable internet-facing servers"
    ],
    cyber_resource: "TryHackMe Passive Reconnaissance room"
  },
  {
    day_number: 52,
    dsa_topic: "Mixed Review — Stacks & Queues Mediums",
    dsa_tasks: [
      "Solve: Decode String on LeetCode",
      "Solve: Evaluate Reverse Polish Notation",
      "Use stack to track multipliers and bracket nesting levels"
    ],
    dsa_resource: "LeetCode Mediums tag",
    cyber_topic: "Nmap Port Scanning Techniques",
    cyber_tasks: [
      "Understand TCP Connect scan (-sT) vs SYN Stealth scan (-sS)",
      "Learn UDP scan (-sU) and how it handles packet drop responses",
      "Differentiate scan flags: -p- (all ports), -F (fast), -O (OS detection), -sV (service version)"
    ],
    cyber_resource: "TryHackMe Nmap Room & Network Security course"
  },
  {
    day_number: 53,
    dsa_topic: "Mixed Review — Recursion & Backtracking Mediums",
    dsa_tasks: [
      "Solve: Subsets (using both cascade iteration and backtracking)",
      "Solve: Restore IP Addresses on LeetCode",
      "Prune IP branches when segment lengths exceed 3 characters or value exceeds 255"
    ],
    dsa_resource: "LeetCode Mediums tag",
    cyber_topic: "Nmap Scripting Engine & Vuln Scanning",
    cyber_tasks: [
      "Learn how Nmap Scripting Engine (NSE) scripts are configured and run",
      "Run nmap scripts for vulnerability detection: --script=vuln",
      "Learn how to export nmap results in XML/normal formats (-oA)"
    ],
    cyber_resource: "TryHackMe Nmap Room & Nmap documentation"
  },
  {
    day_number: 54,
    dsa_topic: "Mixed Review — Binary Search Mediums",
    dsa_tasks: [
      "Solve: Search in Rotated Sorted Array II (duplicates present)",
      "Solve: Find Peak Element on LeetCode",
      "Explain the O(log N) average complexity binary search peak finder logic"
    ],
    dsa_resource: "LeetCode Mediums tag",
    cyber_topic: "TryHackMe — Nmap Room Completion",
    cyber_tasks: [
      "Complete all tasks in the TryHackMe 'Nmap' room",
      "Answer questions about packet flags (RST, SYN/ACK) in scan responses",
      "Document the command flags you used to complete the room challenges"
    ],
    cyber_resource: "TryHackMe Nmap room"
  },
  {
    day_number: 55,
    dsa_topic: "Mixed Review — Timed Coding Test",
    dsa_tasks: [
      "Attempt 3 random medium problems under a 75-minute limit",
      "Write clean code and test against custom edge cases",
      "Document performance details (time spent per problem)"
    ],
    dsa_resource: "LeetCode Custom Contest / Self-Timer",
    cyber_topic: "Web Scanning Basics",
    cyber_tasks: [
      "Learn how to perform web directory brute-forcing using Gobuster / Dirbuster",
      "Discover hidden paths and admin interfaces on a target lab site",
      "Understand response codes: 200 (OK), 301/302 (Redirects), 403 (Forbidden), 404 (Not Found)"
    ],
    cyber_resource: "TryHackMe Web Scanning / Gobuster basics"
  },

  // WEEK 9: Days 56 - 62
  {
    day_number: 56,
    dsa_topic: "Weekly Check-in Day 8",
    dsa_tasks: [
      "Review weak spots in mixed LeetCode problems",
      "Practice dry-running binary search rotated array questions",
      "Clean up folder structure of week 8 source code solutions"
    ],
    dsa_resource: "Self-Test / LeetCode",
    cyber_topic: "Weekly Check-in Day 8 - Cyber",
    cyber_tasks: [
      "Verify all TryHackMe Nmap and scanning rooms are completed",
      "Review scanning options and write brief summary of SYN vs TCP scans",
      "Start preparing Metasploit VM environment"
    ],
    cyber_resource: "Self-Review / TryHackMe"
  },
  {
    day_number: 57,
    dsa_topic: "Trees — Binary Tree Representation",
    dsa_tasks: [
      "Implement a Binary Tree Node class with left and right children",
      "Implement iterative Inorder, Preorder, and Postorder traversals",
      "Implement Level Order Traversal (BFS) using a queue"
    ],
    dsa_resource: "takeUforward Trees playlist Ep 1-5",
    cyber_topic: "Introduction to Metasploit Framework",
    cyber_tasks: [
      "Understand Metasploit Architecture: msfconsole, database setup (msfdb init)",
      "Learn basic search and use commands: search, use, show options, info",
      "Identify the differences between Exploit, Auxiliary, and Post modules"
    ],
    cyber_resource: "TryHackMe 'Metasploit' room Part 1"
  },
  {
    day_number: 58,
    dsa_topic: "Trees — Height & Depth",
    dsa_tasks: [
      "Solve: Maximum Depth of Binary Tree",
      "Solve: Minimum Depth of Binary Tree",
      "Compare BFS vs DFS recursive approach for tree height"
    ],
    dsa_resource: "takeUforward Trees playlist Ep 6-8",
    cyber_topic: "Metasploit Modules & Configuration",
    cyber_tasks: [
      "Learn payload types: Staged vs Non-staged (inline) payloads",
      "Understand setting parameters: LHOST, LPORT, RHOSTS, RPORT",
      "Learn basic session management: sessions -l, sessions -i"
    ],
    cyber_resource: "TryHackMe 'Metasploit' room Part 2"
  },
  {
    day_number: 59,
    dsa_topic: "Trees — Diameter of Binary Tree",
    dsa_tasks: [
      "Solve: Diameter of Binary Tree on LeetCode",
      "Understand why maximum path does not need to pass through root",
      "Optimize depth search to calculate diameter in O(N) single-pass"
    ],
    dsa_resource: "takeUforward Trees playlist Ep 9-11",
    cyber_topic: "Metasploit — Exploiting a Vuln",
    cyber_tasks: [
      "Locate and exploit a vulnerable service (e.g. mock Samba/MS08-067 or HTTP server) in lab VM",
      "Configure reverse TCP shell listener and catch incoming connection",
      "Execute basic post-exploitation commands: getuid, sysinfo"
    ],
    cyber_resource: "TryHackMe Metasploit labs"
  },
  {
    day_number: 60,
    dsa_topic: "Trees — Balanced Binary Tree",
    dsa_tasks: [
      "Solve: Balanced Binary Tree checking on LeetCode",
      "Return height if balanced, otherwise -1 to bubble up state",
      "Ensure time complexity is strictly O(N)"
    ],
    dsa_resource: "takeUforward Trees playlist Ep 12-14",
    cyber_topic: "TryHackMe — Metasploit Room Part 1",
    cyber_tasks: [
      "Complete first half of TryHackMe Metasploit room tasks",
      "Configure and run db_nmap inside Metasploit database",
      "Verify targets are imported into hosts table in msfconsole"
    ],
    cyber_resource: "TryHackMe Metasploit room"
  },
  {
    day_number: 61,
    dsa_topic: "Trees — Symmetry & Identity",
    dsa_tasks: [
      "Solve: Same Tree on LeetCode",
      "Solve: Symmetric Tree on LeetCode",
      "Write recursive base cases for nodes comparison"
    ],
    dsa_resource: "takeUforward Trees playlist Ep 15-17",
    cyber_topic: "TryHackMe — Metasploit Room Part 2",
    cyber_tasks: [
      "Complete the remaining tasks in Metasploit room",
      "Experiment with exploit upgrades using post/multi/manage/shell_to_meterpreter",
      "Document the difference between standard shell and Meterpreter console"
    ],
    cyber_resource: "TryHackMe Metasploit room"
  },
  {
    day_number: 62,
    dsa_topic: "Trees — Lowest Common Ancestor",
    dsa_tasks: [
      "Solve: Lowest Common Ancestor of a Binary Tree",
      "Solve: Path Sum on LeetCode",
      "Analyze recursive return values for left and right tree paths"
    ],
    dsa_resource: "takeUforward Trees playlist Ep 18-20",
    cyber_topic: "Metasploit Post-Exploitation Basics",
    cyber_tasks: [
      "Learn hashdump command to extract local SAM hashes",
      "Use search command to find configuration and credentials files on target",
      "Practice pivoting concepts conceptually (portfwd command)"
    ],
    cyber_resource: "Offensive Security Metasploit Unleashed guide"
  },

  // WEEK 10: Days 63 - 69
  {
    day_number: 63,
    dsa_topic: "Weekly Check-in Day 9",
    dsa_tasks: [
      "Solve 3 mixed Binary Tree problems",
      "Draw the recursion stack trace for Symmetric Tree checks",
      "Review post-exploitation commands from Metasploit"
    ],
    dsa_resource: "Self-Test / LeetCode",
    cyber_topic: "Weekly Check-in Day 9 - Cyber",
    cyber_tasks: [
      "Ensure all Metasploit lab worksheets are completed",
      "Outline the payload differences (staged vs non-staged)",
      "Set up PortSwigger Web Academy account"
    ],
    cyber_resource: "Self-Review / PortSwigger"
  },
  {
    day_number: 64,
    dsa_topic: "BST — Search & Insert",
    dsa_tasks: [
      "Understand properties of Binary Search Trees (left < root < right)",
      "Solve: Search in a Binary Search Tree",
      "Solve: Insert into a Binary Search Tree"
    ],
    dsa_resource: "takeUforward Trees playlist Ep 21-23",
    cyber_topic: "PortSwigger SQLi — Retrieving Hidden Data",
    cyber_tasks: [
      "Read SQL Injection introduction on PortSwigger",
      "Complete lab: SQL injection vulnerability in WHERE clause allowing retrieval of hidden data",
      "Write explanation of how `' OR 1=1--` bypasses filters"
    ],
    cyber_resource: "PortSwigger Web Security Academy - SQL Injection"
  },
  {
    day_number: 65,
    dsa_topic: "BST — Delete Node",
    dsa_tasks: [
      "Solve: Delete Node in a BST on LeetCode",
      "Handle three deletion scenarios (0, 1, or 2 children)",
      "Find inorder successor/predecessor for parent stitching"
    ],
    dsa_resource: "takeUforward Trees playlist Ep 24-25",
    cyber_topic: "PortSwigger SQLi — Subverting Logic",
    cyber_tasks: [
      "Complete lab: SQL injection vulnerability allowing login bypass",
      "Differentiate SQL injection payloads for MySQL vs PostgreSQL vs Oracle comments",
      "Write down SQL query templates reflecting these vulnerabilities"
    ],
    cyber_resource: "PortSwigger Web Security Academy - SQL Injection"
  },
  {
    day_number: 66,
    dsa_topic: "BST — Validate BST",
    dsa_tasks: [
      "Solve: Validate Binary Search Tree on LeetCode",
      "Pass min and max bounds recursively to ensure children comply",
      "Understand why checking left.val < root.val is insufficient"
    ],
    dsa_resource: "takeUforward Trees playlist Ep 26",
    cyber_topic: "PortSwigger SQLi — UNION Attacks I",
    cyber_tasks: [
      "Understand UNION query prerequisites (same columns count and compatible types)",
      "Complete lab: SQL injection UNION attack, determining the number of columns returned by the query",
      "Construct payloads using `ORDER BY` and `UNION SELECT NULL` techniques"
    ],
    cyber_resource: "PortSwigger Web Security Academy - SQL Injection"
  },
  {
    day_number: 67,
    dsa_topic: "BST — Kth Smallest Element",
    dsa_tasks: [
      "Solve: Kth Smallest Element in a BST on LeetCode",
      "Optimize search by doing in-order traversal up to K items",
      "Solve: Lowest Common Ancestor of a Binary Search Tree"
    ],
    dsa_resource: "takeUforward Trees playlist Ep 27-28",
    cyber_topic: "PortSwigger SQLi — UNION Attacks II",
    cyber_tasks: [
      "Complete lab: SQL injection UNION attack, finding a column containing text",
      "Complete lab: SQL injection UNION attack, retrieving data from other tables",
      "Retrieve credentials database table schema using database logs"
    ],
    cyber_resource: "PortSwigger Web Security Academy - SQL Injection"
  },
  {
    day_number: 68,
    dsa_topic: "BST — Convert Array to BST",
    dsa_tasks: [
      "Solve: Convert Sorted Array to Binary Search Tree on LeetCode",
      "Use middle element as root and recurse for left and right sub-arrays",
      "Verify height balancing of the resulting tree"
    ],
    dsa_resource: "takeUforward Trees playlist Ep 29",
    cyber_topic: "PortSwigger SQLi — Blind SQLi I",
    cyber_tasks: [
      "Understand Blind SQL Injection concept (boolean-based checks)",
      "Complete lab: Blind SQL injection with conditional responses",
      "Write a short Python automation script to script character extraction"
    ],
    cyber_resource: "PortSwigger Web Security Academy - SQL Injection"
  },
  {
    day_number: 69,
    dsa_topic: "BST — Mixed Review",
    dsa_tasks: [
      "Solve: Two Sum IV - Input is a BST",
      "Solve: Recover Binary Search Tree",
      "Compare BST space complexity to hashmap based Two Sum"
    ],
    dsa_resource: "LeetCode BST tags",
    cyber_topic: "PortSwigger SQLi — Blind SQLi II",
    cyber_tasks: [
      "Understand time-based SQL Injection concepts",
      "Complete lab: Blind SQL injection with time delays and information retrieval",
      "Analyze response latency measurements for character tracking"
    ],
    cyber_resource: "PortSwigger Web Security Academy - SQL Injection"
  },

  // WEEK 11: Days 70 - 76
  {
    day_number: 70,
    dsa_topic: "Weekly Check-in Day 10",
    dsa_tasks: [
      "Solve 3 mixed BST problems",
      "Walk through deleting node from BST by hand",
      "Compile SQLi lab notes and automation scripts"
    ],
    dsa_resource: "Self-Test / LeetCode",
    cyber_topic: "Weekly Check-in Day 10 - Cyber",
    cyber_tasks: [
      "Submit all SQLi PortSwigger certifications/labs in tracking sheet",
      "Briefly review remediation for SQLi: Parameterized Queries (Prepared Statements)",
      "Review differences between SQLi and XSS conceptually"
    ],
    cyber_resource: "Self-Review / OWASP"
  },
  {
    day_number: 71,
    dsa_topic: "Heaps — Representation & Heapify",
    dsa_tasks: [
      "Learn heap representation in arrays (left = 2i+1, right = 2i+2)",
      "Implement heapify-down and heapify-up helpers",
      "Analyze time complexity of build_heap (O(N) proof)"
    ],
    dsa_resource: "takeUforward Heaps playlist Ep 1-2",
    cyber_topic: "PortSwigger XSS — Reflected into HTML",
    cyber_tasks: [
      "Understand Cross-Site Scripting (XSS) categories: Reflected, Stored, DOM",
      "Complete lab: Reflected XSS into HTML context with nothing encoded",
      "Construct basic payloads: `<script>alert(1)</script>` or `<img src=x onerror=alert(1)>`"
    ],
    cyber_resource: "PortSwigger Web Security Academy - XSS"
  },
  {
    day_number: 72,
    dsa_topic: "Heaps — Implementations",
    dsa_tasks: [
      "Implement Max Heap from scratch with insert and extractMax",
      "Implement Min Heap from scratch with insert and extractMin",
      "Verify structure after inserting arbitrary array numbers"
    ],
    dsa_resource: "takeUforward Heaps playlist Ep 3-4",
    cyber_topic: "PortSwigger XSS — Stored into HTML",
    cyber_tasks: [
      "Understand risks of Stored XSS compared to Reflected XSS",
      "Complete lab: Stored XSS into HTML context with nothing encoded",
      "Test payload persistence by reloading pages after trigger"
    ],
    cyber_resource: "PortSwigger Web Security Academy - XSS"
  },
  {
    day_number: 73,
    dsa_topic: "Heaps — Kth Largest Element",
    dsa_tasks: [
      "Solve: Kth Largest Element in an Array (using min heap)",
      "Explain why space complexity is O(K) and time is O(N log K)",
      "Compare heap approach to QuickSelect algorithm conceptually"
    ],
    dsa_resource: "takeUforward Heaps playlist Ep 5",
    cyber_topic: "PortSwigger XSS — DOM XSS Basics",
    cyber_tasks: [
      "Understand DOM sinks and sources (document.write, location.search)",
      "Complete lab: DOM XSS in document.write sink using source location.search",
      "Inspect source code flow using browser DevTools debugger"
    ],
    cyber_resource: "PortSwigger Web Security Academy - XSS"
  },
  {
    day_number: 74,
    dsa_topic: "Heaps — Top K Frequent Elements",
    dsa_tasks: [
      "Solve: Top K Frequent Elements on LeetCode",
      "Combine frequency counting map with min heap or bucket sort",
      "Analyze complexity differences of map + heap vs bucket sort"
    ],
    dsa_resource: "takeUforward Heaps playlist Ep 6",
    cyber_topic: "PortSwigger XSS — Attribute Context Reflected",
    cyber_tasks: [
      "Complete lab: Reflected XSS into attribute context",
      "Break out of HTML attribute tags using double quotes and custom attributes",
      "Construct payloads: `\" autofocus onfocus=alert(1) x=\"`"
    ],
    cyber_resource: "PortSwigger Web Security Academy - XSS"
  },
  {
    day_number: 75,
    dsa_topic: "Heaps — K Closest Points",
    dsa_tasks: [
      "Solve: K Closest Points to Origin on LeetCode",
      "Compute Euclidean distance and store coordinates inside heap",
      "Analyze heap sorting overheads"
    ],
    dsa_resource: "NeetCode Heaps playlist",
    cyber_topic: "PortSwigger XSS — Attribute Context Stored",
    cyber_tasks: [
      "Complete lab: Stored XSS into anchor href attribute context",
      "Inject javascript pseudo-protocols into link targets: `javascript:alert(1)`",
      "Document remediation: Context-Aware Output Encoding"
    ],
    cyber_resource: "PortSwigger Web Security Academy - XSS"
  },
  {
    day_number: 76,
    dsa_topic: "Heaps — Merge K Sorted Lists",
    dsa_tasks: [
      "Solve: Merge K Sorted Lists on LeetCode",
      "Store active list nodes inside Min Heap and iterate extraction",
      "Analyze runtime: O(N log K) where N is total node count"
    ],
    dsa_resource: "takeUforward Heaps playlist Ep 7",
    cyber_topic: "PortSwigger XSS — Stealing Cookies",
    cyber_tasks: [
      "Understand session hijacking vulnerabilities via cookie theft",
      "Complete lab: Exploiting cross-site scripting to steal cookies",
      "Set up target webhook or server listener to receive exfiltrated document.cookie values"
    ],
    cyber_resource: "PortSwigger Web Security Academy - XSS"
  },

  // WEEK 12: Days 77 - 83
  {
    day_number: 77,
    dsa_topic: "Weekly Check-in Day 11",
    dsa_tasks: [
      "Solve 3 mixed Heap problems under timed conditions",
      "Trace heapify actions during Kth Largest execution",
      "Document XSS types and cookie theft setups"
    ],
    dsa_resource: "Self-Test / LeetCode",
    cyber_topic: "Weekly Check-in Day 11 - Cyber",
    cyber_tasks: [
      "Check off XSS PortSwigger labs checklist",
      "Briefly review remediation for XSS: input validation, output encoding, Content Security Policy (CSP)",
      "Set up AWS Free Tier account or configure AWS CLI"
    ],
    cyber_resource: "Self-Review / AWS"
  },
  {
    day_number: 78,
    dsa_topic: "Graphs — Representations",
    dsa_tasks: [
      "Learn Adjacency Matrix representation and code implementation",
      "Learn Adjacency List representation and code implementation",
      "Analyze space complexity: O(V²) vs O(V + E) where V=vertices, E=edges"
    ],
    dsa_resource: "takeUforward Graphs playlist Ep 1-4",
    cyber_topic: "Cloud Concepts & AWS Infrastructure",
    cyber_tasks: [
      "Learn AWS Regions, Availability Zones (AZs), and Edge Locations",
      "Understand AWS Global Infrastructure design and high availability principles",
      "Complete AWS Skill Builder: Cloud Practitioner Essentials Module 1"
    ],
    cyber_resource: "AWS Skill Builder free course"
  },
  {
    day_number: 79,
    dsa_topic: "Graphs — BFS Implementation",
    dsa_tasks: [
      "Implement Breadth First Search (BFS) for a disconnected graph",
      "Use visited array and queue to manage nodes",
      "Analyze BFS time complexity: O(V + E)"
    ],
    dsa_resource: "takeUforward Graphs playlist Ep 5-6",
    cyber_topic: "AWS Identity & Access Management Basics",
    cyber_tasks: [
      "Differentiate Users, Groups, Roles, and Policies in AWS",
      "Write a simple JSON policy that grants read-only access to S3 buckets",
      "Complete AWS Skill Builder IAM module"
    ],
    cyber_resource: "AWS IAM Documentation + Skill Builder"
  },
  {
    day_number: 80,
    dsa_topic: "Graphs — DFS Implementation",
    dsa_tasks: [
      "Implement Depth First Search (DFS) recursively",
      "Use visited array and recursion stack to manage nodes",
      "Analyze DFS time complexity: O(V + E)"
    ],
    dsa_resource: "takeUforward Graphs playlist Ep 7-8",
    cyber_topic: "IAM Policies, Users, and Roles",
    cyber_tasks: [
      "Understand IAM Role delegation and cross-account access concepts",
      "Create a custom IAM User with limited program access keys on your AWS account",
      "Configure your local CLI profile using AWS configure command"
    ],
    cyber_resource: "AWS CLI Installation & Configuration Guide"
  },
  {
    day_number: 81,
    dsa_topic: "Graphs — Number of Islands",
    dsa_tasks: [
      "Solve: Number of Islands on LeetCode",
      "Implement using BFS grid traversal",
      "Implement using DFS recursive grid traversal"
    ],
    dsa_resource: "takeUforward Graphs playlist Ep 9",
    cyber_topic: "AWS Shared Responsibility Model",
    cyber_tasks: [
      "Learn customer responsibilities vs AWS responsibilities",
      "Identify who controls patching for EC2 (Customer) vs RDS (AWS)",
      "Draw up a matrix representing these shared security boundaries"
    ],
    cyber_resource: "AWS Shared Responsibility Model documentation"
  },
  {
    day_number: 82,
    dsa_topic: "Graphs — Clone Graph",
    dsa_tasks: [
      "Solve: Clone Graph on LeetCode",
      "Use BFS or DFS with a hashmap to map original nodes to cloned nodes",
      "Test graph clone correctness on cyclic graphs"
    ],
    dsa_resource: "takeUforward Graphs playlist Ep 10",
    cyber_topic: "AWS CLI Configuration",
    cyber_tasks: [
      "Run commands: aws iam list-users, aws s3 ls to verify credentials work",
      "Export profiles and understand AWS credential files in `~/.aws/` directory",
      "Differentiate access keys from session tokens (temporary credentials)"
    ],
    cyber_resource: "AWS CLI User Guide"
  },
  {
    day_number: 83,
    dsa_topic: "Graphs — Max Area of Island",
    dsa_tasks: [
      "Solve: Max Area of Island on LeetCode",
      "Optimize DFS to return area counts and sum them up",
      "Ensure visited cells are correctly updated to prevent stack overflows"
    ],
    dsa_resource: "NeetCode Graphs playlist",
    cyber_topic: "AWS IAM Security Best Practices",
    cyber_tasks: [
      "Enable Multi-Factor Authentication (MFA) on AWS Root Account",
      "Understand Least Privilege Principle for policy configurations",
      "Use Access Advisor to identify unused IAM permissions"
    ],
    cyber_resource: "AWS IAM Security Best Practices documentation"
  },

  // WEEK 13: Days 84 - 90
  {
    day_number: 84,
    dsa_topic: "Weekly Check-in Day 12",
    dsa_tasks: [
      "Solve 3 mixed Graph BFS/DFS problems",
      "Review complexity variations of representations",
      "Verify AWS CLI permissions and test connectivity"
    ],
    dsa_resource: "Self-Test / LeetCode",
    cyber_topic: "Weekly Check-in Day 12 - Cyber",
    cyber_tasks: [
      "Document AWS IAM concepts in your study guide",
      "Review the Shared Responsibility Model configurations",
      "Prepare for basic VPC infrastructure components"
    ],
    cyber_resource: "Self-Review / AWS"
  },
  {
    day_number: 85,
    dsa_topic: "Graphs — Undirected Cycle Detection",
    dsa_tasks: [
      "Solve: Cycle Detection in Undirected Graph (using BFS)",
      "Solve: Cycle Detection in Undirected Graph (using DFS)",
      "Keep track of parent node to prevent checking back to immediately previous node"
    ],
    dsa_resource: "takeUforward Graphs playlist Ep 11-12",
    cyber_topic: "AWS VPC Subnets & Route Tables",
    cyber_tasks: [
      "Learn Virtual Private Cloud (VPC) fundamentals: IP CIDR blocks",
      "Differentiate Public Subnet vs Private Subnet configurations",
      "Understand Route Tables and Internet Gateway (IGW) routing setups"
    ],
    cyber_resource: "AWS VPC Documentation + Professor Messer Netsec"
  },
  {
    day_number: 86,
    dsa_topic: "Graphs — Directed Cycle Detection",
    dsa_tasks: [
      "Solve: Cycle Detection in Directed Graph (using DFS recursion stack)",
      "Understand why undirected cycle detection logic fails on directed graphs",
      "Solve: Cycle Detection in Directed Graph (using Kahn's algorithm BFS)"
    ],
    dsa_resource: "takeUforward Graphs playlist Ep 13-14",
    cyber_topic: "AWS VPC Security Groups vs Network ACLs",
    cyber_tasks: [
      "Differentiate Security Groups (stateful, resource level) vs Network ACLs (stateless, subnet level)",
      "Configure simple rules: allow ingress 80/443, deny all other connections",
      "Draw packet traversal flow showing where NACL and Security Group checks trigger"
    ],
    cyber_resource: "AWS VPC Security Groups documentation"
  },
  {
    day_number: 87,
    dsa_topic: "Graphs — Connected Components Count",
    dsa_tasks: [
      "Solve: Number of Connected Components in an Undirected Graph (LeetCode Premium / GFG)",
      "Implement using multiple BFS/DFS outer loop invocations",
      "Compare runtime overhead to BFS grid traversal"
    ],
    dsa_resource: "takeUforward Graphs playlist Ep 15",
    cyber_topic: "AWS EC2 Instance & Security Groups",
    cyber_tasks: [
      "Launch a free-tier t2.micro Linux instance inside a public subnet",
      "Create security group allowing SSH (22) from your IP only",
      "SSH into the instance and verify routing works"
    ],
    cyber_resource: "AWS EC2 User Guide"
  },
  {
    day_number: 88,
    dsa_topic: "Graphs — Water Flow",
    dsa_tasks: [
      "Solve: Pacific Atlantic Water Flow on LeetCode",
      "Traverse backwards from ocean boundaries inwards to find common cells",
      "Write down path exploration strategies"
    ],
    dsa_resource: "NeetCode Graphs playlist",
    cyber_topic: "AWS S3 Buckets & Policy Management",
    cyber_tasks: [
      "Create an S3 bucket with a unique name",
      "Differentiate S3 ACLs vs Bucket Policies vs IAM Policies",
      "Apply a bucket policy allowing read access to a specific IAM role only"
    ],
    cyber_resource: "AWS S3 Security documentation"
  },
  {
    day_number: 89,
    dsa_topic: "Graphs — Course Schedule",
    dsa_tasks: [
      "Solve: Course Schedule on LeetCode (detect cycle in directed graph)",
      "Build adjacency list representation from edges array input",
      "Optimize checks using state array (0=unvisited, 1=visiting, 2=visited)"
    ],
    dsa_resource: "takeUforward Graphs playlist Ep 21-22",
    cyber_topic: "AWS S3 Encryption & Block Public Access",
    cyber_tasks: [
      "Understand S3 Server-Side Encryption (SSE-S3 vs SSE-KMS)",
      "Enable 'Block Public Access' setting on bucket level",
      "Verify bucket is private by trying to access S3 URL without authorization"
    ],
    cyber_resource: "AWS S3 Security best practices"
  },
  {
    day_number: 90,
    dsa_topic: "Graphs — Course Schedule II Intro",
    dsa_tasks: [
      "Solve: Course Schedule II (find topological sorting order)",
      "Implement topological sort using DFS recursion",
      "Ensure cycle detection logic is integrated"
    ],
    dsa_resource: "takeUforward Graphs playlist Ep 23-24",
    cyber_topic: "AWS Config & CloudTrail Logging",
    cyber_tasks: [
      "Learn what CloudTrail does (recording user API calls)",
      "Create a trail logging all S3 bucket events and write logs to S3",
      "Verify logs are generated in S3 after accessing folders"
    ],
    cyber_resource: "AWS CloudTrail User Guide"
  },

  // WEEK 14: Days 91 - 97
  {
    day_number: 91,
    dsa_topic: "Weekly Check-in Day 13",
    dsa_tasks: [
      "Solve 3 mixed Graph Course Schedule variations",
      "Compare Kahn's vs DFS topological sort algorithms",
      "Verify CloudTrail logging in AWS account"
    ],
    dsa_resource: "Self-Test / LeetCode",
    cyber_topic: "Weekly Check-in Day 13 - Cyber",
    cyber_tasks: [
      "Analyze S3 bucket encryption setup configurations",
      "Write a short summary on SGs vs NACLs",
      "Reflect on Pentesting vs Cloud vs Blue Team exposure so far"
    ],
    cyber_resource: "Self-Review / AWS"
  },
  {
    day_number: 92,
    dsa_topic: "Mixed Graphs — Undirected components",
    dsa_tasks: [
      "Solve: Graph Valid Tree on LeetCode / GFG",
      "Verify: no cycle exists AND graph is fully connected",
      "Contrast validation constraints of trees vs graphs"
    ],
    dsa_resource: "LeetCode Graph tags",
    cyber_topic: "Domain Comparison — Pentesting vs Cloud vs Blue Team",
    cyber_tasks: [
      "Compare Pentesting (offensive, bug bounties, AD testing)",
      "Compare Cloud Security (hardening, configuration audits, DevSecOps)",
      "Compare Blue Team (SIEM, log analysis, threat hunting, SOC analyst)"
    ],
    cyber_resource: "Self-Assessment / Research blogs"
  },
  {
    day_number: 93,
    dsa_topic: "Mixed Graphs — Rotting Oranges",
    dsa_tasks: [
      "Solve: Rotting Oranges on LeetCode (multisource BFS)",
      "Track active queues layer by layer to represent time steps",
      "Verify bounds and unreached fresh oranges remaining"
    ],
    dsa_resource: "takeUforward Graphs playlist Ep 16-17",
    cyber_topic: "Lab Practice Checkpoint — Web vs Infra",
    cyber_tasks: [
      "Review PortSwigger SQLi/XSS labs solved so far",
      "Review AWS IAM and EC2 labs completed",
      "Identify which lab type felt most engaging and record a rating (1-5)"
    ],
    cyber_resource: "Self-Reflection / Lab logs"
  },
  {
    day_number: 94,
    dsa_topic: "Mixed Graphs — Walls and Gates",
    dsa_tasks: [
      "Solve: Walls and Gates on LeetCode / GFG",
      "Perform multisource BFS from all gate locations simultaneously",
      "Analyze time and space complexity of BFS from boundaries"
    ],
    dsa_resource: "NeetCode Graphs playlist",
    cyber_topic: "Foundational Knowledge Review",
    cyber_tasks: [
      "Review TCP/IP packet header structures and ports",
      "Review Linux navigation and shell scripting syntax",
      "Review symmetric vs asymmetric encryption formulas"
    ],
    cyber_resource: "Security+ Study Guide / Linux logs"
  },
  {
    day_number: 95,
    dsa_topic: "Mixed Graphs — Redundant Connection",
    dsa_tasks: [
      "Solve: Redundant Connection on LeetCode",
      "Find cyclic edge in undirected graph",
      "Analyze DFS cyclic check speed vs upcoming Union-Find solution"
    ],
    dsa_resource: "NeetCode Graphs playlist",
    cyber_topic: "Assessing Pentesting Interests",
    cyber_tasks: [
      "Read about Web Pentesting (OWASP Top 10) vs Infrastructure Pentesting",
      "Research tools: Burp Suite, Metasploit, Nmap, Wireshark",
      "Assess interest level in Pentesting and log 1-5"
    ],
    cyber_resource: "OWASP Top 10 + Pentesting blogs"
  },
  {
    day_number: 96,
    dsa_topic: "Mixed Graphs — Graph Valid Tree",
    dsa_tasks: [
      "Solve: Number of Operations to Make Network Connected",
      "Verify connected components counts",
      "Determine minimum edges required to connect disconnected subgraphs"
    ],
    dsa_resource: "takeUforward Graphs playlist Ep 18",
    cyber_topic: "Assessing Cloud Security Interests",
    cyber_tasks: [
      "Read about Cloud Security (IAM, GuardDuty, Terraform hardening, Kubernetes)",
      "Differentiate DevSecOps pipelines from traditional infrastructure security",
      "Assess interest level in Cloud Security and log 1-5"
    ],
    cyber_resource: "DevSecOps / Cloud Security blogs"
  },
  {
    day_number: 97,
    dsa_topic: "Mixed Graphs — Review",
    dsa_tasks: [
      "Re-solve Course Schedule with DFS and BFS to contrast approaches",
      "Write down graph representation template for interviews",
      "Optimize graph BFS code structure"
    ],
    dsa_resource: "Self-Review / LeetCode",
    cyber_topic: "Domain Selection Checkpoint",
    cyber_tasks: [
      "Review all ratings from Day 93 to 96",
      "Select your top 2 domains to deep dive on (e.g. Domain 1: Pentesting, Domain 2: Cloud)",
      "Configure targets and resources for Weeks 15-20 deep-dive"
    ],
    cyber_resource: "Self-Review / Curriculum Plan"
  },

  // WEEK 15: Days 98 - 104
  {
    day_number: 98,
    dsa_topic: "Weekly Check-in Day 14",
    dsa_tasks: [
      "Solve 3 mixed Graph problems without notes",
      "Map out graph algorithms time complexities table",
      "Review chosen domains parameters"
    ],
    dsa_resource: "Self-Test / LeetCode",
    cyber_topic: "Weekly Check-in Day 14 - Cyber",
    cyber_tasks: [
      "Register accounts for HackTheBox or configure cloud environments based on Domain 1",
      "Ensure virtual sandbox is clean and ready for penetration labs",
      "Draft research goals for the chosen domain deep dive"
    ],
    cyber_resource: "Self-Review / HackTheBox"
  },
  {
    day_number: 99,
    dsa_topic: "Shortest Path — Dijkstra's Algorithm",
    dsa_tasks: [
      "Implement Dijkstra's Algorithm using adjacency list and Min Heap",
      "Explain why simple queue fails for weighted shortest paths",
      "Analyze time complexity: O((V + E) log V)"
    ],
    dsa_resource: "takeUforward Graphs playlist Ep 32-34",
    cyber_topic: "Domain 1: HackTheBox Starting Point Tier 0",
    cyber_tasks: [
      "Set up OpenVPN connection to HackTheBox lab network",
      "Spawn Meow target and scan using Nmap",
      "Explore Telnet command to capture target flags"
    ],
    cyber_resource: "HackTheBox Starting Point - Meow"
  },
  {
    day_number: 100,
    dsa_topic: "Shortest Path — Network Delay Time",
    dsa_tasks: [
      "Solve: Network Delay Time on LeetCode",
      "Apply Dijkstra to find maximum shortest path from source",
      "Handle edge cases of disconnected graphs correctly"
    ],
    dsa_resource: "takeUforward Graphs playlist Ep 35",
    cyber_topic: "Domain 1: HTB Starting Point - FTP Focus",
    cyber_tasks: [
      "Spawn Fawn target and perform service scans",
      "Log in to target FTP service anonymously (`anonymous:anonymous`)",
      "Exfiltrate text flag and document directory contents"
    ],
    cyber_resource: "HackTheBox Starting Point - Fawn"
  },
  {
    day_number: 101,
    dsa_topic: "Union-Find — Disjoint Set Union Basics",
    dsa_tasks: [
      "Implement Union-Find class with find and union operations",
      "Implement Union by Rank optimization",
      "Implement Path Compression optimization"
    ],
    dsa_resource: "takeUforward Graphs playlist Ep 46-47",
    cyber_topic: "Domain 1: HTB Starting Point - SMB Focus",
    cyber_tasks: [
      "Spawn Dancing target on HTB",
      "Use smbclient tool to list public network shares on target",
      "Navigate directory listings to extract hidden flags"
    ],
    cyber_resource: "HackTheBox Starting Point - Dancing"
  },
  {
    day_number: 102,
    dsa_topic: "Union-Find — Kruskal's Algorithm",
    dsa_tasks: [
      "Solve: Redundant Connection (using Union-Find for cycle check)",
      "Explain amortized query complexity: O(alpha(V)) where alpha is inverse Ackermann",
      "Understand Kruskal's MST algorithm conceptually"
    ],
    dsa_resource: "takeUforward Graphs playlist Ep 48-49",
    cyber_topic: "Domain 1: HTB Starting Point - Redis Focus",
    cyber_tasks: [
      "Spawn Redeemer target on HTB",
      "Install and configure redis-cli tools locally",
      "Query target Redis databases for stored session flags"
    ],
    cyber_resource: "HackTheBox Starting Point - Redeemer"
  },
  {
    day_number: 103,
    dsa_topic: "Shortest Path — Cheapest Flights",
    dsa_tasks: [
      "Solve: Cheapest Flights Within K Stops on LeetCode",
      "Apply modified Dijkstra tracking stopping constraints",
      "Compare with Bellman-Ford shortest path algorithm conceptually"
    ],
    dsa_resource: "takeUforward Graphs playlist Ep 38",
    cyber_topic: "Domain 1: HTB Starting Point - MSSQL Focus",
    cyber_tasks: [
      "Spawn Archetype target (Tier 1 box)",
      "Discover exposed MSSQL ports and connect via mssqlclient",
      "Perform SQL query commands to check service configurations"
    ],
    cyber_resource: "HackTheBox Starting Point - Archetype"
  },
  {
    day_number: 104,
    dsa_topic: "Union-Find — Connected Components DSU",
    dsa_tasks: [
      "Solve: Number of Provinces on LeetCode (using DSU)",
      "Optimize connected count calculations dynamically during union operations",
      "Compare DSU runtime to recursive DFS on adjacency lists"
    ],
    dsa_resource: "takeUforward Graphs playlist Ep 50",
    cyber_topic: "Domain 1: HTB Starting Point - Web IDOR",
    cyber_tasks: [
      "Spawn Oopsie target (Tier 1 web challenge)",
      "Discover user access parameters and inspect URLs",
      "Modify parameters to exploit Insecure Direct Object Reference (IDOR) and gain admin access"
    ],
    cyber_resource: "HackTheBox Starting Point - Oopsie"
  },

  // WEEK 16: Days 105 - 111
  {
    day_number: 105,
    dsa_topic: "Weekly Check-in Day 15",
    dsa_tasks: [
      "Solve 3 mixed Dijkstra and Union-Find problems",
      "Review path compression proof steps",
      "Organize HTB walkthrough reports"
    ],
    dsa_resource: "Self-Test / LeetCode",
    cyber_topic: "Weekly Check-in Day 15 - Cyber",
    cyber_tasks: [
      "Submit HTB flags and verify Tier 0 completion status",
      "Document the steps used to pivot / exploit Redeemer and Oopsie",
      "Configure Domain 2 setup environments (Cloud Logging)"
    ],
    cyber_resource: "Self-Review / HackTheBox"
  },
  {
    day_number: 106,
    dsa_topic: "Graphs — Topological Sort (Kahn)",
    dsa_tasks: [
      "Implement Kahn's Algorithm (BFS) for topological sort",
      "Track node in-degrees dynamically",
      "Explain how in-degree queue handles cycle loops"
    ],
    dsa_resource: "takeUforward Graphs playlist Ep 22",
    cyber_topic: "Domain 2: Cloud — AWS CloudTrail Analysis",
    cyber_tasks: [
      "Understand cloud audit concepts (trail logs)",
      "Query CloudTrail S3 objects using AWS Athena or local python parsers",
      "Filter logs by EventName: CreateKeyPair, DeleteBucket, PutBucketPolicy"
    ],
    cyber_resource: "AWS CloudTrail Athena Query Guide"
  },
  {
    day_number: 107,
    dsa_topic: "Graphs — Course Schedule II Full",
    dsa_tasks: [
      "Solve: Course Schedule II (full sorting arrays)",
      "Write both Kahn's BFS and DFS implementations for comparison",
      "Test edge cases like fully disconnected nodes"
    ],
    dsa_resource: "takeUforward Graphs playlist Ep 24",
    cyber_topic: "Domain 2: Cloud — IAM Policy Hardening",
    cyber_tasks: [
      "Set up IAM Policy Simulator in AWS Console",
      "Test custom user access capabilities against simulated APIs",
      "Refactor wide permissive policies (e.g. s3:*) to grant specific resources and actions only"
    ],
    cyber_resource: "AWS IAM Policy Simulator documentation"
  },
  {
    day_number: 108,
    dsa_topic: "MST — Prim's Algorithm",
    dsa_tasks: [
      "Implement Prim's Minimum Spanning Tree algorithm",
      "Use visited arrays and Min Heap to select minimum edges",
      "Explain time complexity differences of Prim's vs Kruskal's"
    ],
    dsa_resource: "takeUforward Graphs playlist Ep 45",
    cyber_topic: "Domain 2: Cloud — VPC Flow Logs",
    cyber_tasks: [
      "Enable VPC Flow Logs to record network packet metadata",
      "Configure log deliveries to CloudWatch Logs or S3",
      "Query Flow Logs to find rejected inbound traffic on port 22"
    ],
    cyber_resource: "AWS VPC Flow Logs documentation"
  },
  {
    day_number: 109,
    dsa_topic: "MST — Min Cost to Connect Points",
    dsa_tasks: [
      "Solve: Min Cost to Connect All Points on LeetCode",
      "Implement using Prim's algorithm",
      "Implement using Kruskal's algorithm + DSU"
    ],
    dsa_resource: "NeetCode Graphs playlist",
    cyber_topic: "Domain 2: Cloud — S3 Bucket Policy Hardening",
    cyber_tasks: [
      "Write an S3 Bucket Policy that denies unencrypted object uploads",
      "Apply policy to an active S3 bucket",
      "Verify policy locks by attempting an unencrypted upload via CLI"
    ],
    cyber_resource: "AWS S3 encryption bucket policies"
  },
  {
    day_number: 110,
    dsa_topic: "Graphs — Alien Dictionary",
    dsa_tasks: [
      "Solve: Alien Dictionary (LeetCode Premium / GFG variant)",
      "Build graph dependencies from lexicographical order comparisons",
      "Perform topological sort and detect contradictions (cycles)"
    ],
    dsa_resource: "takeUforward Graphs playlist Ep 26",
    cyber_topic: "Domain 2: Cloud — AWS KMS Security",
    cyber_tasks: [
      "Create a symmetric Customer Managed Key (CMK) in AWS KMS",
      "Configure key policies to restrict access to a specific role",
      "Test decrypt operations on test files using CLI keys"
    ],
    cyber_resource: "AWS KMS Developer Guide"
  },
  {
    day_number: 111,
    dsa_topic: "Graphs — Matrix Longest Path",
    dsa_tasks: [
      "Solve: Longest Increasing Path in a Matrix on LeetCode",
      "Use DFS + Memoization to prevent redundant paths",
      "Analyze time complexity: O(M * N)"
    ],
    dsa_resource: "NeetCode Graphs playlist",
    cyber_topic: "Domain 2: Cloud — GuardDuty & Security Hub",
    cyber_tasks: [
      "Learn how GuardDuty performs threat detection using AI/ML logs",
      "Configure Security Hub to inspect AWS configurations against CIS Benchmarks",
      "Document compliance score and trace 3 failed benchmark checks"
    ],
    cyber_resource: "AWS GuardDuty + Security Hub documentation"
  },

  // WEEK 17: Days 112 - 118
  {
    day_number: 112,
    dsa_topic: "Weekly Check-in Day 16",
    dsa_tasks: [
      "Solve 3 mixed Topological Sort and MST problems",
      "Compare Kahn's vs Prim's data structures overhead",
      "Verify AWS Security Hub CIS compliance logs"
    ],
    dsa_resource: "Self-Test / LeetCode",
    cyber_topic: "Weekly Check-in Day 16 - Cyber",
    cyber_tasks: [
      "Document VPC Flow logs filtering commands",
      "Explain how S3 policies enforce server-side encryption",
      "Download Elastic/Splunk free packages"
    ],
    cyber_resource: "Self-Review / Logs"
  },
  {
    day_number: 113,
    dsa_topic: "DP 1D — Climbing Stairs",
    dsa_tasks: [
      "Understand Dynamic Programming fundamentals (overlapping subproblems + optimal substructure)",
      "Solve: Climbing Stairs (recursive -> memoization -> tabulation -> space optimized)",
      "Write down the space requirements for each approach"
    ],
    dsa_resource: "takeUforward DP playlist Ep 1-4",
    cyber_topic: "Blue Team — SIEM Introduction",
    cyber_tasks: [
      "Learn SIEM concepts (Security Information and Event Management)",
      "Understand log collection: Agents, Syslog, Event Forwarding",
      "Trace the log lifecycle: collection -> normalization -> correlation -> alerting"
    ],
    cyber_resource: "TryHackMe 'SIEM' room"
  },
  {
    day_number: 114,
    dsa_topic: "DP 1D — Min Cost Climbing",
    dsa_tasks: [
      "Solve: Min Cost Climbing Stairs on LeetCode",
      "Implement using memoization",
      "Implement using space-optimized tabulation (O(1) space)"
    ],
    dsa_resource: "takeUforward DP playlist Ep 5",
    cyber_topic: "Blue Team — Setting up SIEM VM",
    cyber_tasks: [
      "Set up ELK (Elasticsearch, Logstash, Kibana) or Splunk Free tier in VirtualBox VM",
      "Configure Kibana console access and log in",
      "Verify elasticsearch cluster health status is green"
    ],
    cyber_resource: "Elastic Stack Installation Guide"
  },
  {
    day_number: 115,
    dsa_topic: "DP 1D — House Robber",
    dsa_tasks: [
      "Solve: House Robber on LeetCode",
      "Define state transition equation: dp[i] = max(dp[i-1], dp[i-2] + nums[i])",
      "Implement space-optimized O(1) variable swaps"
    ],
    dsa_resource: "takeUforward DP playlist Ep 6",
    cyber_topic: "Blue Team — Sysmon Logs Ingestion",
    cyber_tasks: [
      "Install Sysmon (System Monitor) on a Windows lab host",
      "Configure Winlogbeat/Elastic Agent to forward Sysmon logs to SIEM VM",
      "Verify Windows security logs are visible in SIEM index"
    ],
    cyber_resource: "Winlogbeat configuration guide + Microsoft Sysmon docs"
  },
  {
    day_number: 116,
    dsa_topic: "DP 1D — House Robber II",
    dsa_tasks: [
      "Solve: House Robber II on LeetCode (houses arranged in circular loop)",
      "Solve by splitting into two linear problems (exclude first vs exclude last house)",
      "Verify boundary constraints on single-house arrays"
    ],
    dsa_resource: "takeUforward DP playlist Ep 7-8",
    cyber_topic: "Blue Team — Syslog Ingestion",
    cyber_tasks: [
      "Configure rsyslog on a Linux lab host to forward messages to SIEM server",
      "Verify auth.log and syslog events are parsed into SIEM indexes",
      "Check that hostname mappings align correctly"
    ],
    cyber_resource: "Rsyslog client-server setup guide"
  },
  {
    day_number: 117,
    dsa_topic: "DP 1D — Coin Change",
    dsa_tasks: [
      "Solve: Coin Change on LeetCode",
      "Formulate recurrence relation: dp[i] = min(dp[i], dp[i - coin] + 1)",
      "Solve: Coin Change II (combinations count)"
    ],
    dsa_resource: "takeUforward DP playlist Ep 9-11",
    cyber_topic: "Blue Team — SIEM Query Syntax",
    cyber_tasks: [
      "Learn KQL (Kibana Query Language) or SPL (Splunk Search Processing Language) basic commands",
      "Run queries to filter by: event.code: 4625 (Failed logon)",
      "Run queries to filter by specific process names: whoami, cmd.exe, PowerShell"
    ],
    cyber_resource: "KQL / SPL syntax cheat sheets"
  },
  {
    day_number: 118,
    dsa_topic: "DP 1D — Longest Increasing Subsequence",
    dsa_tasks: [
      "Solve: Longest Increasing Subsequence on LeetCode",
      "Implement O(N²) DP tabulation solution",
      "Implement O(N log N) binary search solution (using tails array)"
    ],
    dsa_resource: "takeUforward DP playlist Ep 41-43",
    cyber_topic: "Blue Team — SIEM Security Dashboards",
    cyber_tasks: [
      "Create a custom Kibana/Splunk dashboard displaying failed login counts",
      "Configure visualization charts (bar charts, metrics summaries)",
      "Verify dashboard updates in real-time as logs flow"
    ],
    cyber_resource: "Kibana Dashboard design guide"
  },

  // WEEK 18: Days 119 - 125
  {
    day_number: 119,
    dsa_topic: "Weekly Check-in Day 17",
    dsa_tasks: [
      "Solve 3 mixed 1D DP problems under time limit",
      "Walk through LIS binary search optimizations",
      "Query SIEM dashboard logs for Windows events"
    ],
    dsa_resource: "Self-Test / LeetCode",
    cyber_topic: "Weekly Check-in Day 17 - Cyber",
    cyber_tasks: [
      "Document KQL / SPL query commands used this week",
      "Verify Windows Sysmon service status is running",
      "Prepare brute-force simulation scripts"
    ],
    cyber_resource: "Self-Review / SIEM"
  },
  {
    day_number: 120,
    dsa_topic: "DP 2D — 0/1 Knapsack Formulation",
    dsa_tasks: [
      "Understand 2D Dynamic Programming state representation: dp[i][w]",
      "Implement recursive 0/1 Knapsack with memoization",
      "Implement bottom-up tabulation and optimize space to 1D array"
    ],
    dsa_resource: "takeUforward DP playlist Ep 19",
    cyber_topic: "Blue Team — Brute-Force Attack Simulation",
    cyber_tasks: [
      "Use Hydra or custom scripts to simulate SSH brute force on Linux VM",
      "Verify that SSH service logs failed authentication attempts",
      "Examine logs in SIEM to identify attacker IP address"
    ],
    cyber_resource: "Hydra documentation + Linux auth logs"
  },
  {
    day_number: 121,
    dsa_topic: "DP 2D — Unique Paths",
    dsa_tasks: [
      "Solve: Unique Paths on LeetCode",
      "Formulate recurrence relation: dp[i][j] = dp[i-1][j] + dp[i][j-1]",
      "Optimize space to O(N) columns array representation"
    ],
    dsa_resource: "takeUforward DP playlist Ep 14-15",
    cyber_topic: "Blue Team — Alert Rules Creation",
    cyber_tasks: [
      "Write a SIEM detection rule for brute force (e.g. 10 failed login attempts within 1 minute)",
      "Trigger rule using Hydra simulation",
      "Verify alert email or dashboard notification is triggered successfully"
    ],
    cyber_resource: "Kibana Security alerts guide"
  },
  {
    day_number: 122,
    dsa_topic: "DP 2D — Longest Common Subsequence",
    dsa_tasks: [
      "Solve: Longest Common Subsequence on LeetCode",
      "Write memoization matrix and compare with tabulation",
      "Print the actual LCS string using parent pointers"
    ],
    dsa_resource: "takeUforward DP playlist Ep 25-26",
    cyber_topic: "Blue Team — IDS/IPS Basics",
    cyber_tasks: [
      "Understand Intrusion Detection/Prevention systems (IDS/IPS)",
      "Learn differences between signature-based vs anomaly-based detection",
      "Install Snort or Suricata on Linux server VM"
    ],
    cyber_resource: "TryHackMe 'Snort' room"
  },
  {
    day_number: 123,
    dsa_topic: "DP 2D — Edit Distance",
    dsa_tasks: [
      "Solve: Edit Distance on LeetCode",
      "Define operations costs: Insert, Delete, Replace",
      "Trace the DP table dry run for 'horse' -> 'ros'"
    ],
    dsa_resource: "takeUforward DP playlist Ep 33-34",
    cyber_topic: "Blue Team — Wireshark Packet Analysis",
    cyber_tasks: [
      "Capture packets using Wireshark during web browsing",
      "Filter capture: `http` or `dns` or `tcp.flags.syn==1`",
      "Follow TCP Stream on an unencrypted HTTP traffic capture to extract text data"
    ],
    cyber_resource: "Wireshark User Guide + TryHackMe Wireshark rooms"
  },
  {
    day_number: 124,
    dsa_topic: "DP 2D — Unique Paths II",
    dsa_tasks: [
      "Solve: Unique Paths II (incorporate grid obstacles)",
      "Verify grid bounds and obstacle cell initialization dynamically",
      "Analyze O(M * N) space and runtime requirements"
    ],
    dsa_resource: "takeUforward DP playlist Ep 16",
    cyber_topic: "Blue Team — Suspicious Command Alerts",
    cyber_tasks: [
      "Create a SIEM detection rule filtering for process executions of whoami/hostname/net user",
      "Simulate commands on target host",
      "Verify logs capture commands arguments and trigger notifications"
    ],
    cyber_resource: "SIEM Audit rule documentation"
  },
  {
    day_number: 125,
    dsa_topic: "DP 2D — Subset Sum",
    dsa_tasks: [
      "Solve: Partition Equal Subset Sum on LeetCode",
      "Reduce to Target Sum checking: sum(nums) / 2",
      "Optimize DP table space allocations"
    ],
    dsa_resource: "takeUforward DP playlist Ep 20-22",
    cyber_topic: "Blue Team — Event Correlation Basics",
    cyber_tasks: [
      "Understand correlating multiple log sources (e.g. firewall reject + failed SSH logon)",
      "Write a correlation query tracking IP patterns matching multiple tables",
      "Document sample attack chains mapping recon to system compromises"
    ],
    cyber_resource: "SIEM Event Correlation guide"
  },

  // WEEK 19: Days 126 - 132
  {
    day_number: 126,
    dsa_topic: "Weekly Check-in Day 18",
    dsa_tasks: [
      "Solve 3 mixed 2D DP problems",
      "Dry run Edit Distance DP table",
      "Review Snort IDS rules syntax and commands"
    ],
    dsa_resource: "Self-Test / LeetCode",
    cyber_topic: "Weekly Check-in Day 18 - Cyber",
    cyber_tasks: [
      "Check off packet capture analysis findings in notes",
      "Verify event correlation alerts are working on SIEM VM",
      "Install Docker Desktop or prepare AppSec environment"
    ],
    cyber_resource: "Self-Review / Docker"
  },
  {
    day_number: 127,
    dsa_topic: "Greedy — Activity Selection",
    dsa_tasks: [
      "Understand Greedy Choice Property vs Optimal Substructure",
      "Solve: N Meetings in One Room (GFG / LeetCode interval scheduling)",
      "Sort activities by end times and prove why this is mathematically optimal"
    ],
    dsa_resource: "takeUforward Greedy playlist Ep 1-2",
    cyber_topic: "AppSec — OWASP Juice Shop Setup",
    cyber_tasks: [
      "Launch OWASP Juice Shop container inside Docker: `docker run -d -p 3000:3000 bkimminich/juice-shop`",
      "Browse site at `http://localhost:3000`",
      "Locate the Score Board page using URL path discovery"
    ],
    cyber_resource: "OWASP Juice Shop Git repository"
  },
  {
    day_number: 128,
    dsa_topic: "Greedy — Jump Game",
    dsa_tasks: [
      "Solve: Jump Game on LeetCode",
      "Solve using Dynamic Programming (memoization) for comparison",
      "Implement O(N) Greedy maximum-reachable-index search"
    ],
    dsa_resource: "takeUforward Greedy playlist Ep 3",
    cyber_topic: "AppSec — Broken Object Level Authorization",
    cyber_tasks: [
      "Learn what BOLA/IDOR (Insecure Direct Object Reference) is",
      "Navigate to target account pages in Juice Shop and intercept requests in Burp Suite",
      "Modify basket IDs in JSON requests to view other users' items"
    ],
    cyber_resource: "TryHackMe 'Juice Shop' room / BOLA docs"
  },
  {
    day_number: 129,
    dsa_topic: "Greedy — Jump Game II",
    dsa_tasks: [
      "Solve: Jump Game II on LeetCode (minimum jumps required)",
      "Write down the state transitions for O(N) linear scan jumps search",
      "Compare with BFS layer traversal conceptually"
    ],
    dsa_resource: "takeUforward Greedy playlist Ep 4",
    cyber_topic: "AppSec — SQLi Exploitation & Remediation",
    cyber_tasks: [
      "Locate search / login forms in Juice Shop vulnerable to SQL injection",
      "Exploit forms to retrieve secret credentials databases",
      "Write code snippet illustrating parameterized input validation to prevent this"
    ],
    cyber_resource: "OWASP SQL Injection prevention cheatsheet"
  },
  {
    day_number: 130,
    dsa_topic: "Greedy — Gas Station",
    dsa_tasks: [
      "Solve: Gas Station on LeetCode",
      "Analyze conditions for circular loop completion",
      "Implement single-pass O(N) tracking remaining fuel levels"
    ],
    dsa_resource: "NeetCode Greedy playlist",
    cyber_topic: "AppSec — Broken Authentication",
    cyber_tasks: [
      "Understand Brute Force vulnerabilities in authorization forms",
      "Run Burp Suite Intruder to perform credential stuffing against admin login",
      "Implement account lockouts or rate-limiting concepts to protect endpoints"
    ],
    cyber_resource: "OWASP Authentication cheatsheet"
  },
  {
    day_number: 131,
    dsa_topic: "Greedy — Hand of Straights",
    dsa_tasks: [
      "Solve: Hand of Straights on LeetCode",
      "Use Min Heap or Treemap to sort and track card counts",
      "Verify sorting and checking complexities"
    ],
    dsa_resource: "NeetCode Greedy playlist",
    cyber_topic: "AppSec — Sensitive Data Exposure",
    cyber_tasks: [
      "Examine backup/configurations directories exposed on web assets",
      "Extract confidential configuration logs containing API key variables",
      "Explain how to configure `.gitignore` and secret managers to prevent leaks"
    ],
    cyber_resource: "OWASP Sensitive Data Exposure docs"
  },
  {
    day_number: 132,
    dsa_topic: "Greedy — Merge Intervals",
    dsa_tasks: [
      "Solve: Merge Intervals on LeetCode",
      "Solve: Insert Interval on LeetCode",
      "Analyze interval intersection scenarios (overlap, contain, separate)"
    ],
    dsa_resource: "takeUforward Greedy playlist Ep 5-6",
    cyber_topic: "AppSec — Static Application Security Testing",
    cyber_tasks: [
      "Understand Static Application Security Testing (SAST) concepts",
      "Install SonarQube Community edition or run Semgrep via command line on a codebase",
      "Scan a test directory and review the vulnerability report findings"
    ],
    cyber_resource: "Semgrep documentation"
  },

  // WEEK 20: Days 133 - 139
  {
    day_number: 133,
    dsa_topic: "Weekly Check-in Day 19",
    dsa_tasks: [
      "Solve 3 mixed Greedy and Interval problems",
      "Dry run Gas Station on [1, 2, 3, 4, 5]",
      "Verify Semgrep scan outputs on local files"
    ],
    dsa_resource: "Self-Test / LeetCode",
    cyber_topic: "Weekly Check-in Day 19 - Cyber",
    cyber_tasks: [
      "Document all Juice Shop flags unlocked in notes",
      "Briefly review remediation for OWASP Top 10 web vulnerabilities",
      "Review study material and syllabi for chosen specialization cert"
    ],
    cyber_resource: "Self-Review / Certification Syllabus"
  },
  {
    day_number: 134,
    dsa_topic: "Tries — Implementation",
    dsa_tasks: [
      "Implement TrieNode class with children array and isEnd flag",
      "Implement Trie class with insert, search, and startsWith",
      "Compare lookup times of Tries vs Hash Maps"
    ],
    dsa_resource: "takeUforward Trie playlist Ep 1-2",
    cyber_topic: "Cert Prep — Specialization Selection",
    cyber_tasks: [
      "Choose your final track: Security+ (Foundational), AWS Certified Security Specialty (Cloud), OSCP (Pentesting), or CySA+ (Blue Team)",
      "Download official exam guidelines and outline core domains weights",
      "Locate reference books, online training portals, or practice questions sets"
    ],
    cyber_resource: "Certifying Body Official Website"
  },
  {
    day_number: 135,
    dsa_topic: "Tries — Word Dictionary",
    dsa_tasks: [
      "Solve: Design Add and Search Words Data Structure on LeetCode",
      "Support wildcard search dot character '.' using backtracking",
      "Analyze worst-case search complexity"
    ],
    dsa_resource: "takeUforward Trie playlist Ep 3",
    cyber_topic: "Cert Prep — Study Schedule & Materials",
    cyber_tasks: [
      "Create study planner mapping weeks to exam objectives",
      "Gather study tools: flashcards, terminal setups, or cloud subscription configs",
      "Take baseline diagnostic quiz to establish initial scoring levels"
    ],
    cyber_resource: "Cert practice exam portal"
  },
  {
    day_number: 136,
    dsa_topic: "Tries — Word Search II",
    dsa_tasks: [
      "Solve: Word Search II on LeetCode (Trie + DFS Matrix Backtracking)",
      "Prune recursion paths early by checking trie prefix matching",
      "Optimize by deleting matched words from Trie to prevent duplicate results"
    ],
    dsa_resource: "takeUforward Trie playlist Ep 4",
    cyber_topic: "Cert Prep — Domain 1 Study",
    cyber_tasks: [
      "Study Domain 1: e.g. Threat Management (CySA+) / Cryptography (Security+) / Threat actors (OSCP)",
      "Take detailed notes on key concepts, procedures, and commands",
      "Attempt 20 practice questions on this domain"
    ],
    cyber_resource: "Cert Study Guide"
  },
  {
    day_number: 137,
    dsa_topic: "Tries — Autocomplete",
    dsa_tasks: [
      "Solve: Longest Word in Dictionary on LeetCode",
      "Solve: Search Suggestions System on LeetCode",
      "Use sorting + binary search or Trie traversal for prefix matches"
    ],
    dsa_resource: "takeUforward Trie playlist Ep 5",
    cyber_topic: "Cert Prep — Domain 2 Study",
    cyber_tasks: [
      "Study Domain 2: e.g. Vulnerability Management (CySA+) / Identity and Access (Security+) / Web attacks (OSCP)",
      "Take notes on configurations and command line tools usage",
      "Attempt 20 practice questions on this domain"
    ],
    cyber_resource: "Cert Study Guide"
  },
  {
    day_number: 138,
    dsa_topic: "Tries — Replace Words",
    dsa_tasks: [
      "Solve: Replace Words on LeetCode",
      "Map words to their shortest prefix in Trie",
      "Analyze space complexity of building Trie vs original string length"
    ],
    dsa_resource: "LeetCode Trie tags",
    cyber_topic: "Cert Prep — Domain 3 Study",
    cyber_tasks: [
      "Study Domain 3: e.g. Cyber Incident Response (CySA+) / Secure Architecture (Security+) / Privilege Escalation (OSCP)",
      "Document response procedures, commands, or hardening scripts",
      "Attempt 20 practice questions on this domain"
    ],
    cyber_resource: "Cert Study Guide"
  },
  {
    day_number: 139,
    dsa_topic: "Tries — Maximum XOR",
    dsa_tasks: [
      "Solve: Maximum XOR of Two Numbers in an Array on LeetCode",
      "Implement using binary Trie (store bits 0 and 1)",
      "Explain how greedy bit traversal maximizes XOR outcome"
    ],
    dsa_resource: "takeUforward Trie playlist Ep 6-7",
    cyber_topic: "Cert Prep — Diagnostic Assessment",
    cyber_tasks: [
      "Complete comprehensive practice quiz covering studied domains",
      "Verify correctness and record details of failed answers",
      "Update flashcards with missing concepts discovered"
    ],
    cyber_resource: "Cert Practice Portal"
  },

  // WEEK 21: Days 140 - 146
  {
    day_number: 140,
    dsa_topic: "Weekly Check-in Day 20",
    dsa_tasks: [
      "Solve 3 mixed Trie problems",
      "Explain how prefix check optimizes Word Search II",
      "Review cert domains diagnostic test scoring details"
    ],
    dsa_resource: "Self-Test / LeetCode",
    cyber_topic: "Weekly Check-in Day 20 - Cyber",
    cyber_tasks: [
      "Compile flashcards database for exam terminology",
      "Review target metrics for the upcoming specialization labs",
      "Configure virtualization or cloud logins for active lab builds"
    ],
    cyber_resource: "Self-Review / Study Guide"
  },
  {
    day_number: 141,
    dsa_topic: "Mixed Random Set 1",
    dsa_tasks: [
      "Solve: Container With Most Water (Two Pointer Medium)",
      "Solve: Copy List with Random Pointer (Linked List Medium)",
      "Solve: Subnets (Backtracking Medium)"
    ],
    dsa_resource: "LeetCode Custom Set (No labels)",
    cyber_topic: "Specialization Labs — Host Hardening / Advanced IAM",
    cyber_tasks: [
      "If Pentesting/Blue: perform local host privilege escalation lab",
      "If Cloud: construct IAM policies validating least privilege limits",
      "Document configurations, commands, and results in lab journal"
    ],
    cyber_resource: "Domain Lab Portal (e.g. TryHackMe / AWS Labs)"
  },
  {
    day_number: 142,
    dsa_topic: "Mixed Random Set 2",
    dsa_tasks: [
      "Solve: Target Sum (DP Medium)",
      "Solve: Gas Station (Greedy Medium)",
      "Solve: Merge k Sorted Lists (Heap Hard)"
    ],
    dsa_resource: "LeetCode Custom Set (No labels)",
    cyber_topic: "Specialization Labs — Active Directory / Federated IAM",
    cyber_tasks: [
      "If Pentesting/Blue: learn Active Directory structure and attack paths",
      "If Cloud: set up Single Sign-On (SSO) with federated identities in AWS IAM",
      "Write short description of authentication trust configurations"
    ],
    cyber_resource: "Domain Lab Portal"
  },
  {
    day_number: 143,
    dsa_topic: "Mixed Random Set 3",
    dsa_tasks: [
      "Solve: Binary Tree Zigzag Level Order Traversal (Tree Medium)",
      "Solve: Longest Consecutive Sequence (Hash Set Medium)",
      "Solve: Remove K Digits (Stack Medium)"
    ],
    dsa_resource: "LeetCode Custom Set (No labels)",
    cyber_topic: "Specialization Labs — Password Auditing / KMS Policies",
    cyber_tasks: [
      "If Pentesting/Blue: run Hashcat to audit password strength of local hashes",
      "If Cloud: write Key Policies to restrict decrypt capabilities on IAM Roles",
      "Document cracking rates and hashing formats or KMS policy logs"
    ],
    cyber_resource: "Domain Lab Portal"
  },
  {
    day_number: 144,
    dsa_topic: "Mixed Random Set 4",
    dsa_tasks: [
      "Solve: Course Schedule (Graph Cycle DFS Medium)",
      "Solve: Search in Rotated Sorted Array (Binary Search Medium)",
      "Solve: Letter Combinations of a Phone Number (Backtracking Medium)"
    ],
    dsa_resource: "LeetCode Custom Set (No labels)",
    cyber_topic: "Specialization Labs — Web Security / AWS WAF",
    cyber_tasks: [
      "If Pentesting/Blue: exploit local file inclusion (LFI) in testing VM",
      "If Cloud: configure AWS WAF rules blocking SQLi/XSS scripts",
      "Verify access blocks by running test curl scripts against target"
    ],
    cyber_resource: "Domain Lab Portal"
  },
  {
    day_number: 145,
    dsa_topic: "Mixed Random Set 5",
    dsa_tasks: [
      "Solve: Valid Parenthesis String (Monotonic Stack Medium)",
      "Solve: Next Permutation (Math/Array Medium)",
      "Solve: Reorder List (Linked List Medium)"
    ],
    dsa_resource: "LeetCode Custom Set (No labels)",
    cyber_topic: "Specialization Labs — Privilege Escalation / GuardDuty Response",
    cyber_tasks: [
      "If Pentesting/Blue: exploit SUID binaries on Linux for privilege escalation",
      "If Cloud: simulate GuardDuty alerts and trigger EventBridge notifications",
      "Document escalation steps or incident response event flows"
    ],
    cyber_resource: "Domain Lab Portal"
  },
  {
    day_number: 146,
    dsa_topic: "Mixed Random Set 6",
    dsa_tasks: [
      "Solve: Longest Common Subsequence (DP Medium)",
      "Solve: Find Peak Element (Binary Search Medium)",
      "Solve: Path Sum II (Tree DFS Medium)"
    ],
    dsa_resource: "LeetCode Custom Set (No labels)",
    cyber_topic: "Specialization Labs — Weekly Summary",
    cyber_tasks: [
      "Review all specialization lab steps completed this week",
      "Ensure lab code, commands, and reports are saved to your local journal",
      "Summarize the security controls tested in each lab"
    ],
    cyber_resource: "Self-Review / Lab journal"
  },

  // WEEK 22: Days 147 - 153
  {
    day_number: 147,
    dsa_topic: "Weekly Check-in Day 21",
    dsa_tasks: [
      "Solve 3 mixed medium problems timed",
      "Walk through Next Permutation logic step-by-step",
      "Verify lab journal is fully updated"
    ],
    dsa_resource: "Self-Test / LeetCode",
    cyber_topic: "Weekly Check-in Day 21 - Cyber",
    cyber_tasks: [
      "Format and review lab screenshots and diagrams",
      "Select a completed lab for detailed writeup publication",
      "Structure your personal tech blog repo/folder"
    ],
    cyber_resource: "Self-Review / Writeup template"
  },
  {
    day_number: 148,
    dsa_topic: "Bit Manipulation — Single Number",
    dsa_tasks: [
      "Understand bitwise operations: AND (&), OR (|), XOR (^), NOT (~), Left Shift (<<), Right Shift (>>)",
      "Solve: Single Number on LeetCode (using XOR property: A ^ A = 0)",
      "Explain why XOR space complexity is O(1) compared to hash map"
    ],
    dsa_resource: "takeUforward Bit Manipulation Ep 1-3",
    cyber_topic: "Writeup — Target Lab Selection",
    cyber_tasks: [
      "Select a completed HackTheBox machine or cloud configuration lab to document",
      "Review commands history, nmap output files, and configuration configs",
      "Verify that all steps are reproducible"
    ],
    cyber_resource: "Lab Logs / Journal"
  },
  {
    day_number: 149,
    dsa_topic: "Bit Manipulation — Number of 1 Bits",
    dsa_tasks: [
      "Solve: Number of 1 Bits on LeetCode",
      "Optimize check loop using: n & (n - 1) to clear lowest set bit",
      "Solve: Power of Two checking on LeetCode"
    ],
    dsa_resource: "takeUforward Bit Manipulation Ep 4",
    cyber_topic: "Writeup — Structuring Walkthrough",
    cyber_tasks: [
      "Create a markdown writeup template with sections: Executive Summary, Recon, Exploitation, Hardening",
      "Write the Reconnaissance section including Nmap scan details",
      "Explain the findings and service version details"
    ],
    cyber_resource: "Markdown template"
  },
  {
    day_number: 150,
    dsa_topic: "Bit Manipulation — Counting Bits",
    dsa_tasks: [
      "Solve: Counting Bits on LeetCode",
      "Implement dynamic programming pattern mapping offsets: dp[i] = dp[i >> 1] + (i & 1)",
      "Analyze O(N) space and time complexity compared to naive O(N log N) loops"
    ],
    dsa_resource: "takeUforward Bit Manipulation Ep 5",
    cyber_topic: "Writeup — Exploitation Detail",
    cyber_tasks: [
      "Write the Exploitation section detailing vulnerability triggers and command sequences",
      "Embed screenshots illustrating shell access or successful API executions",
      "Explain the root cause of the vulnerability"
    ],
    cyber_resource: "Self-Review / Journal"
  },
  {
    day_number: 151,
    dsa_topic: "Bit Manipulation — Reverse Bits",
    dsa_tasks: [
      "Solve: Reverse Bits on LeetCode",
      "Use bit shifting loops to stitch reversed result values",
      "Explain why bit mask iterations are optimal"
    ],
    dsa_resource: "takeUforward Bit Manipulation Ep 6",
    cyber_topic: "Writeup — Hardening & Remediation",
    cyber_tasks: [
      "Write the Hardening/Remediation section proposing concrete mitigation steps",
      "Draft policy adjustments or configuration code blocks securing systems",
      "Review the complete draft for spelling, clarity, and formatting"
    ],
    cyber_resource: "Self-Review / Draft"
  },
  {
    day_number: 152,
    dsa_topic: "Bit Manipulation — Missing Number",
    dsa_tasks: [
      "Solve: Missing Number on LeetCode",
      "Solve using XOR matching index with values",
      "Solve using math summation formula: n * (n + 1) / 2"
    ],
    dsa_resource: "takeUforward Bit Manipulation Ep 7",
    cyber_topic: "Writeup — Portfolio Publication",
    cyber_tasks: [
      "Host the writeup using GitHub Pages, Medium, or GitBook",
      "Set up appropriate repository and structure folders",
      "Push markdown file and images to the public host repository"
    ],
    cyber_resource: "GitHub Pages / GitBook platform"
  },
  {
    day_number: 153,
    dsa_topic: "Bit Manipulation — Sum of Two Integers",
    dsa_tasks: [
      "Solve: Sum of Two Integers on LeetCode (add without + or - operators)",
      "Implement using XOR for sum and AND + Shift for carry",
      "Dry run inputs 3 and 2 mapping bit states"
    ],
    dsa_resource: "takeUforward Bit Manipulation Ep 8",
    cyber_topic: "Writeup — Feedback & Sharing",
    cyber_tasks: [
      "Share the published writeup link on LinkedIn, Twitter, or Discord communities",
      "Ask for peer review and feedback on technical accuracy and formatting",
      "Refine the writeup based on feedback received"
    ],
    cyber_resource: "LinkedIn / Twitter / Discord"
  },

  // WEEK 23: Days 154 - 160
  {
    day_number: 154,
    dsa_topic: "Weekly Check-in Day 22",
    dsa_tasks: [
      "Solve 3 mixed Bit Manipulation problems",
      "Summarize bitmask operations templates in notes",
      "Review peer feedback on published writeup"
    ],
    dsa_resource: "Self-Test / LeetCode",
    cyber_topic: "Weekly Check-in Day 22 - Cyber",
    cyber_tasks: [
      "Finalize writeup refinements and update pages",
      "Select major project scope (Pentest vs Cloud vs SIEM)",
      "Draft project architecture and design diagrams"
    ],
    cyber_resource: "Self-Review / Project scope"
  },
  {
    day_number: 155,
    dsa_topic: "Advanced — Segment Tree Construction",
    dsa_tasks: [
      "Learn what a Segment Tree is and its range query capabilities",
      "Implement Segment Tree builder for range sum queries",
      "Analyze construct time complexity: O(N)"
    ],
    dsa_resource: "takeUforward Segment Tree playlist Ep 1-2",
    cyber_topic: "Major Project — Scope and Design",
    cyber_tasks: [
      "Define project goals: e.g. Full network pentesting report / Secure Cloud Landing Zone Terraform / ELK SIEM detection dashboard",
      "Create architecture and threat modeling diagrams",
      "List all components, software versions, and security boundary targets"
    ],
    cyber_resource: "Draw.io / threat modeling logs"
  },
  {
    day_number: 156,
    dsa_topic: "Advanced — Segment Tree Update",
    dsa_tasks: [
      "Implement point update operations in Segment Tree",
      "Solve: Range Sum Query - Mutable on LeetCode",
      "Analyze query and update complexities: O(log N)"
    ],
    dsa_resource: "takeUforward Segment Tree playlist Ep 3",
    cyber_topic: "Major Project — Implementation Phase 1",
    cyber_tasks: [
      "Initialize project repositories and write basic config templates",
      "Configure VMs, cloud subscriptions, or Terraform provider configurations",
      "Verify access credentials and execute initial test deployments"
    ],
    cyber_resource: "GitHub / Terraform / VM console"
  },
  {
    day_number: 157,
    dsa_topic: "Advanced — Longest Common Substring",
    dsa_tasks: [
      "Solve: Longest Common Substring (using 2D DP)",
      "Optimize DP matrix space representation to O(N)",
      "Compare space complexities of substring vs subsequence"
    ],
    dsa_resource: "takeUforward DP playlist Ep 27",
    cyber_topic: "Major Project — Implementation Phase 2",
    cyber_tasks: [
      "Build core project features: configuration files, scripts, or audit configurations",
      "Execute vulnerabilities scans or configure log pipelines to SIEM indexes",
      "Test component connections and resolve errors"
    ],
    cyber_resource: "Project Repository"
  },
  {
    day_number: 158,
    dsa_topic: "Advanced — Edit Distance Reconstruction",
    dsa_tasks: [
      "Solve: Edit Distance (DP optimization)",
      "Write tracking code printing actual edit commands (insert, delete, replace) used",
      "Trace optimization values visually"
    ],
    dsa_resource: "takeUforward DP playlist Ep 35",
    cyber_topic: "Major Project — Implementation Phase 3",
    cyber_tasks: [
      "Perform end-to-end functionality checks",
      "Simulate attack scripts or verify cloud security configurations",
      "Collect logs and audit records for final reporting"
    ],
    cyber_resource: "Project VM / Cloud Watch console"
  },
  {
    day_number: 159,
    dsa_topic: "Advanced — Matrix Chain Multiplication",
    dsa_tasks: [
      "Solve: Matrix Chain Multiplication on LeetCode/GFG",
      "Understand partition DP concepts",
      "Implement memoization solution and trace recursive splits"
    ],
    dsa_resource: "takeUforward DP playlist Ep 48-50",
    cyber_topic: "Major Project — Documentation & Report",
    cyber_tasks: [
      "Draft project documentation detailing: Purpose, Architecture, Configuration steps, Security controls",
      "Write instructions for running / deploying project",
      "Review README file layout and format"
    ],
    cyber_resource: "Markdown editor"
  },
  {
    day_number: 160,
    dsa_topic: "Advanced — Palindrome Partitioning II",
    dsa_tasks: [
      "Solve: Palindrome Partitioning II on LeetCode (minimum cuts)",
      "Optimize using O(N²) DP checks mapping partition cut values",
      "Verify edge cases like single character inputs"
    ],
    dsa_resource: "takeUforward DP playlist Ep 53-54",
    cyber_topic: "Major Project — Publication",
    cyber_tasks: [
      "Push project files, code, and report to public GitHub repository",
      "Add architectural diagrams to README file",
      "Draft a LinkedIn post sharing project link and findings summary"
    ],
    cyber_resource: "GitHub / LinkedIn"
  },

  // WEEK 24: Days 161 - 167
  {
    day_number: 161,
    dsa_topic: "Weekly Check-in Day 23",
    dsa_tasks: [
      "Solve 3 mixed Advanced DP and Segment Tree problems",
      "Verify Matrix Chain Multiplication memoization stack",
      "Review published project repo and resolve warnings"
    ],
    dsa_resource: "Self-Test / LeetCode",
    cyber_topic: "Weekly Check-in Day 23 - Cyber",
    cyber_tasks: [
      "Check off all project goals from tracking document",
      "Ensure github repositories are clean and documented",
      "Locate upcoming weekend CTFs on CTFtime.org"
    ],
    cyber_resource: "Self-Review / CTFtime"
  },
  {
    day_number: 162,
    dsa_topic: "Contests — LeetCode Weekly Contest Practice",
    dsa_tasks: [
      "Complete a virtual LeetCode weekly contest (timed 90 mins)",
      "Aim to solve at least 3 out of 4 problems",
      "Record your global rank and performance details"
    ],
    dsa_resource: "LeetCode Contest page",
    cyber_topic: "CTF — Finding Active Weekend CTF",
    cyber_tasks: [
      "Create team profile on CTFtime.org or join an open community team",
      "Locate and register for an active weekend Jeopardy-style CTF",
      "Configure your local VM tools for the contest"
    ],
    cyber_resource: "CTFtime.org / CTF portal"
  },
  {
    day_number: 163,
    dsa_topic: "Review — Weak Topic Analysis",
    dsa_tasks: [
      "Identify the problem type you struggled with in the contest",
      "Solve 3 medium difficulty questions on that topic",
      "Write down common mistakes you made in the contest"
    ],
    dsa_resource: "LeetCode tags search",
    cyber_topic: "CTF — Reviewing Writeups",
    cyber_tasks: [
      "Read writeups from past CTFs to learn common patterns in Web and Crypto categories",
      "Practice solving 2 archive challenges using writeup solutions",
      "Take notes on commands and scripting shortcuts"
    ],
    cyber_resource: "CTFtime writeup archives"
  },
  {
    day_number: 164,
    dsa_topic: "Contests — LeetCode Biweekly Contest Practice",
    dsa_tasks: [
      "Complete a virtual LeetCode biweekly contest (timed 90 mins)",
      "Compare your performance and speed with the weekly contest",
      "Debug and resolve the third problem if unsolved during time limit"
    ],
    dsa_resource: "LeetCode Contest page",
    cyber_topic: "CTF — Practice Beginner Challenges",
    cyber_tasks: [
      "Attempt 3 beginner-level Jeopardy challenges on PicoCTF or similar platforms",
      "Focus categories: Web Exploitation or Cryptography",
      "Document the commands used to solve them"
    ],
    cyber_resource: "PicoCTF / CTF archives"
  },
  {
    day_number: 165,
    dsa_topic: "Review — Biweekly Performance Analysis",
    dsa_tasks: [
      "Re-solve all biweekly contest questions that you missed",
      "Optimize time and space complexity of your solutions",
      "Update your personal weak-topics tracker log"
    ],
    dsa_resource: "Self-Review / LeetCode",
    cyber_topic: "CTF — Practice Intermediate Challenges",
    cyber_tasks: [
      "Attempt 3 intermediate-level challenges on PicoCTF or HackTheBox Sherlocks",
      "Focus categories: Digital Forensics or Reverse Engineering",
      "Write brief scripts to parse flag formats from outputs"
    ],
    cyber_resource: "PicoCTF / HTB Sherlocks"
  },
  {
    day_number: 166,
    dsa_topic: "Contests — Custom Virtual Contest",
    dsa_tasks: [
      "Set up a custom 4-problem LeetCode virtual contest (2 Easy, 2 Medium)",
      "Complete the contest under a 90-minute time limit",
      "Document time spent on each problem"
    ],
    dsa_resource: "LeetCode custom contest builder",
    cyber_topic: "CTF — Live Event Preparation",
    cyber_tasks: [
      "Establish team communication channels and setup share files",
      "Verify local penetration testing tools: Burp Suite, CyberChef, Wireshark, John the Ripper",
      "Review common CTF commands cheatsheet"
    ],
    cyber_resource: "Self-Review / Tools config"
  },
  {
    day_number: 167,
    dsa_topic: "Review — Unsolved Problems Debugging",
    dsa_tasks: [
      "Trace and resolve all unsolved problems from yesterday's custom contest",
      "Walk through the solutions of top coders to find code shortcuts",
      "Optimize your code structure based on their patterns"
    ],
    dsa_resource: "LeetCode discuss section",
    cyber_topic: "CTF — Live Event Participation",
    cyber_tasks: [
      "Participate actively in the registered live CTF event for at least 4 hours",
      "Submit solved challenges flags to the portal",
      "Save all shell commands, source code files, and screenshots for write-ups"
    ],
    cyber_resource: "CTF Event Portal"
  },

  // WEEK 25: Days 168 - 174
  {
    day_number: 168,
    dsa_topic: "Weekly Check-in Day 24",
    dsa_tasks: [
      "Review weak topics from the contest week",
      "Ensure all virtual contest codes are saved to your local workspace",
      "Review CTF results and flag totals"
    ],
    dsa_resource: "Self-Test / LeetCode",
    cyber_topic: "Weekly Check-in Day 24 - Cyber",
    cyber_tasks: [
      "Format CTF screenshots and draft post-event summaries",
      "Compile certification study metrics",
      "Schedule certification exam date or configure mock engines"
    ],
    cyber_resource: "Self-Review / Cert portal"
  },
  {
    day_number: 169,
    dsa_topic: "Mock Interview 1",
    dsa_tasks: [
      "Participate in a 45-minute peer mock interview or use Pramp platform",
      "Topics: Arrays, Hashing, or Linked Lists",
      "Document the interviewer's feedback on your communication and coding style"
    ],
    dsa_resource: "Pramp / Peer Interview",
    cyber_topic: "Cert Prep — Review Domain Summaries",
    cyber_tasks: [
      "Review summaries and core definitions for all certification domains",
      "Memorize common port numbers, encryption algorithms, and security controls",
      "Quiz yourself using flashcards"
    ],
    cyber_resource: "Cert Study Guide / Anki"
  },
  {
    day_number: 170,
    dsa_topic: "Review — Mock 1 Optimization",
    dsa_tasks: [
      "Re-write the code for Mock Interview 1 question from scratch",
      "Optimize its time and space complexity",
      "Write a short summary on how to explain the solution more clearly"
    ],
    dsa_resource: "Self-Review / Code refactor",
    cyber_topic: "Resume — Documenting Projects",
    cyber_tasks: [
      "Write detailed bullet points for the major projects from Weeks 22-23",
      "Describe technologies used, security controls tested, and results achieved",
      "Use strong action verbs (e.g. Hardened, Configured, Assessed)"
    ],
    cyber_resource: "Resume editor / Project reports"
  },
  {
    day_number: 171,
    dsa_topic: "Mock Interview 2",
    dsa_tasks: [
      "Participate in a 45-minute peer mock interview or use Pramp",
      "Topics: Trees, Graphs, or Dynamic Programming",
      "Document the interviewer's feedback details"
    ],
    dsa_resource: "Pramp / Peer Interview",
    cyber_topic: "Cert Prep — Full Practice Exam",
    cyber_tasks: [
      "Take a full-length, timed certification practice exam (90+ questions)",
      "Grade the exam and record your final percentage",
      "Identify weak areas to review tomorrow"
    ],
    cyber_resource: "Cert practice exam portal"
  },
  {
    day_number: 172,
    dsa_topic: "Review — Mock 2 Optimization",
    dsa_tasks: [
      "Re-write the code for Mock Interview 2 question from scratch",
      "Optimize the time and space complexity",
      "Update your interview notes with structural templates"
    ],
    dsa_resource: "Self-Review / Code refactor",
    cyber_topic: "Resume — Incorporating CTF & Labs",
    cyber_tasks: [
      "Add CTF participation and lab achievements to your resume",
      "List the certifications you are scheduling or hold",
      "Refine the technical skills section formatting"
    ],
    cyber_resource: "Resume editor"
  },
  {
    day_number: 173,
    dsa_topic: "Revision — Key DSA Patterns",
    dsa_tasks: [
      "Review flashcards mapping core DSA patterns (sliding window, two-pointer, BFS, memoization)",
      "Write code templates for binary search, DFS, and topological sort from memory",
      "Ensure all templates are syntax-error free"
    ],
    dsa_resource: "Self-Review / Flashcards",
    cyber_topic: "Cert Prep — Review Incorrect Answers",
    cyber_tasks: [
      "Review all incorrect answers from yesterday's practice exam",
      "Write detailed explanations for the correct answers",
      "Re-quiz yourself on those specific domains"
    ],
    cyber_resource: "Practice exam portal / Study Guide"
  },
  {
    day_number: 174,
    dsa_topic: "Revision — Solved-Problem Log Review",
    dsa_tasks: [
      "Go through your personal solved-problem log of the past weeks",
      "Re-solve 5 problems that you previously flagged as difficult",
      "Verify that you can now solve them under 20 minutes each"
    ],
    dsa_resource: "LeetCode solved history",
    cyber_topic: "Resume — Share & Refine",
    cyber_tasks: [
      "Share your resume draft with peers or mentors for feedback",
      "Incorporate their suggestions on layout, bullet points, and clarity",
      "Save the final version as PDF"
    ],
    cyber_resource: "Resume editor / Google Drive"
  },

  // WEEK 26: Days 175 - 180
  {
    day_number: 175,
    dsa_topic: "Weekly Check-in Day 25",
    dsa_tasks: [
      "Verify all mock interview reviews are documented",
      "Practice dry-running 3 classic array/string interview problems",
      "Review your finalized resume PDF"
    ],
    dsa_resource: "Self-Test / LeetCode",
    cyber_topic: "Weekly Check-in Day 25 - Cyber",
    cyber_tasks: [
      "Confirm certification scheduling confirmation details",
      "Ensure portfolio write-ups are online and accessible",
      "Verify github repositories README layouts"
    ],
    cyber_resource: "Self-Review / Cert email"
  },
  {
    day_number: 176,
    dsa_topic: "Final Mock Interview",
    dsa_tasks: [
      "Participate in a comprehensive mock interview covering coding and basic system design",
      "Document feedback on technical approach, communication, and speed",
      "Assess your performance readiness level (1-5)"
    ],
    dsa_resource: "Pramp / Peer mock",
    cyber_topic: "Portfolio — Polish GitHub Profile",
    cyber_tasks: [
      "Refine your GitHub profile README file with professional bio and project links",
      "Add links to your portfolio writeup blog and cert credentials",
      "Ensure all repositories have clean documentation and screenshots"
    ],
    cyber_resource: "GitHub profile editor"
  },
  {
    day_number: 177,
    dsa_topic: "Revision — Classic Interview Problems",
    dsa_tasks: [
      "Re-solve 10 classic LeetCode Medium problems from trees, graphs, and DP categories",
      "Focus on clean variable naming and modular code structure",
      "Verify that all tests pass without debugging errors"
    ],
    dsa_resource: "LeetCode classic set",
    cyber_topic: "Mock Cyber Interview — Incident Response Walkthrough",
    cyber_tasks: [
      "Practice walking through a web attack incident (e.g. SQLi breach) from detection to recovery",
      "Use the incident response phases as a structured guide for your answers",
      "Record your response and evaluate clarity and professional tone"
    ],
    cyber_resource: "Incident response framework docs"
  },
  {
    day_number: 178,
    dsa_topic: "Final Mock — Technical & Behavioral",
    dsa_tasks: [
      "Complete a mock interview combining coding challenges with behavioral questions (STAR method)",
      "Focus on explaining your thought process clearly before writing code",
      "Request detailed feedback from the interviewer on your communication style"
    ],
    dsa_resource: "Peer Mock / STAR method guide",
    cyber_topic: "Mock Cyber Interview — Ransomware Response",
    cyber_tasks: [
      "Practice walking through a ransomware response scenario on a corporate network",
      "Explain containment strategies, backup restoration verification, and regulatory reporting steps",
      "Record your response and refine details"
    ],
    cyber_resource: "Incident response scenario logs"
  },
  {
    day_number: 179,
    dsa_topic: "Revision — Final Pass on Key Patterns",
    dsa_tasks: [
      "Review time/space complexities of all major sorting and search algorithms",
      "Re-solve 5 quick-trick array and string manipulation problems",
      "Ensure you are fully rested for applications"
    ],
    dsa_resource: "Self-Review / LeetCode",
    cyber_topic: "Portfolio — Organize Blog Index",
    cyber_tasks: [
      "Check that your portfolio writeup blog index page loads instantly",
      "Verify that all links to repositories and cert credentials are functioning",
      "Draft a target list of 10 entry-level cyber/software positions"
    ],
    cyber_resource: "Portfolio blog portal"
  },
  {
    day_number: 180,
    dsa_topic: "Program Wrap-up & Revision",
    dsa_tasks: [
      "Conduct a final pass review of all study notes and flashcards",
      "Review the solved-problem log statistics and total count",
      "Plan your daily job application and interview routines"
    ],
    dsa_resource: "Self-Review / Study logs",
    cyber_topic: "Finalize Job Application Tracker",
    cyber_tasks: [
      "Create a job application tracking spreadsheet with columns: Company, Position, Date Applied, Status, Contacts",
      "Refine your target resume and cover letter templates",
      "Apply to the first 2 target listings on your spreadsheet"
    ],
    cyber_resource: "Job application spreadsheet / LinkedIn"
  }
];

const dir = path.join(__dirname, 'data');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(
  path.join(dir, 'curriculum.json'),
  JSON.stringify(curriculum, null, 2),
  'utf8'
);

console.log(`Generated curriculum.json inside ${dir}. Total days: ${curriculum.length}`);
