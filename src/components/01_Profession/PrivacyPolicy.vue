<template>
  <div class="page-shell">
    <div class="page-header reveal">
      <p class="eyebrow">Privacy</p>
      <h1 class="page-title">Privacy policy</h1>
      <p class="page-subtitle">
        What this site processes, what it does not, and how to exercise your rights. Last updated
        20 October 2026.
      </p>
    </div>

    <article class="card reveal p-6 sm:p-8" style="animation-delay: 0.06s">
      <div class="prose-dark space-y-6 text-sm">
        <section>
          <h2>Data controller</h2>
          <p>
            Roberto Arce, Paris, France.<br />
            Contact:
            <a class="link-accent" href="mailto:roberto_arce_@hotmail.com">roberto_arce_@hotmail.com</a>
          </p>
        </section>

        <section>
          <h2>Short version</h2>
          <ul>
            <li>No account, newsletter, contact form or comment system.</li>
            <li>No advertising, analytics or tracking cookies.</li>
            <li>Fonts are self-hosted; they are not requested from Google.</li>
            <li>
              The CV chatbot runs entirely in your browser. Your questions and answers are not sent
              to a server.
            </li>
            <li>No personal data is sold or shared for marketing.</li>
          </ul>
        </section>

        <section>
          <h2>Hosting</h2>
          <p>
            The site is served by GitHub Pages, operated by GitHub, Inc. (88 Colin P. Kelly Jr.
            Street, San Francisco, CA 94107, USA). GitHub processes technical data such as IP
            address, user agent and request metadata in its server logs for security and
            reliability. The legal basis is my legitimate interest in operating a secure website.
            Retention is governed by GitHub's policies — see the
            <a
              class="link-accent"
              href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement"
              target="_blank"
              rel="noopener"
            >GitHub Privacy Statement</a>.
          </p>
        </section>

        <section>
          <h2>CV chatbot</h2>
          <p>
            The chatbot on <router-link class="link-accent" to="/chatbot">/chatbot</router-link> runs
            on-device with WebLLM and WebGPU. When you first use it, your browser downloads model
            weights from
            <a
              class="link-accent"
              href="https://huggingface.co/Titorium/roberto-cv-models"
              target="_blank"
              rel="noopener"
            >HuggingFace</a>
            and WebAssembly libraries from
            <a
              class="link-accent"
              href="https://github.com/mlc-ai/binary-mlc-llm-libs"
              target="_blank"
              rel="noopener"
            >GitHub</a>. Those providers receive your IP address and user agent as part of the
            request. Your prompts, answers and the CV content stay in your browser; they are not
            transmitted to me or stored on a server. The model files may be cached by your browser;
            you can clear that cache at any time.
          </p>
          <p>
            Legal basis: performance of the service you request by opening the chatbot, and my
            legitimate interest in providing it without a backend.
          </p>
        </section>

        <section>
          <h2>What is not processed</h2>
          <p>
            This site does not use Google Analytics or any other analytics service, advertising
            pixels, social plug-ins or session recording. It does not set cookies. It does not ask
            for your name, email, postal address, payment details or any special-category data.
          </p>
        </section>

        <section>
          <h2>Recipients and international transfers</h2>
          <p>
            The only recipients are the hosting and model-delivery providers described above
            (GitHub and HuggingFace, both in the United States), and only to the extent necessary to
            serve the site or the chatbot. They rely on their applicable transfer safeguards
            (adequacy decisions, the EU-US Data Privacy Framework where applicable, or standard
            contractual clauses). No data is sold.
          </p>
        </section>

        <section>
          <h2>Your rights</h2>
          <p>
            Under the GDPR you have the right to access, rectify, erase, restrict or object to the
            processing of your personal data, and the right to data portability. To exercise them,
            email
            <a class="link-accent" href="mailto:roberto_arce_@hotmail.com">roberto_arce_@hotmail.com</a>.
            I will respond within one month. You may also lodge a complaint with the French
            supervisory authority, the CNIL:
            <a class="link-accent" href="https://www.cnil.fr" target="_blank" rel="noopener">cnil.fr</a>
            (3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07, France).
          </p>
        </section>

        <section>
          <h2>Children</h2>
          <p>
            This portfolio is not directed at children under 16. The Kowoto iOS app has its own
            privacy policy, available from its App Store listing and its
            <a
              class="link-accent"
              href="https://github.com/Robertoarce/kowoto-privacy"
              target="_blank"
              rel="noopener"
            >privacy page</a>.
          </p>
        </section>

        <section>
          <h2>Changes</h2>
          <p>
            If the site's data practices change — for example if analytics or a contact form are
            added — this policy will be updated and the date above revised. The current version is
            1.0, dated 20 October 2026.
          </p>
        </section>

        <p class="text-xs text-faint">
          This policy is provided for transparency and does not constitute legal advice.
        </p>
      </div>
    </article>
  </div>
</template>

<script>
export default {
  name: 'PrivacyPolicy',
};
</script>
