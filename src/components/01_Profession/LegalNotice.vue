<template>
  <div class="page-shell">
    <div class="page-header reveal">
      <p class="eyebrow">Legal</p>
      <h1 class="page-title">Mentions légales</h1>
      <p class="page-subtitle">
        Informations légales sur www.roberto-arce.com — version française, suivie d'une traduction
        anglaise.
      </p>
    </div>

    <article class="card reveal p-6 sm:p-8" style="animation-delay: 0.06s">
      <div class="prose-dark space-y-6 text-sm">
        <section>
          <h2>Éditeur du site</h2>
          <p>
            <strong>Roberto Arce</strong><br />
            Paris, France<br />
            Contact :
            <a class="link-accent" href="mailto:roberto_arce_@hotmail.com">roberto_arce_@hotmail.com</a>
          </p>
          <p>Directeur de la publication : Roberto Arce.</p>
        </section>

        <section>
          <h2>Hébergeur</h2>
          <p>
            GitHub, Inc.<br />
            88 Colin P. Kelly Jr. Street<br />
            San Francisco, CA 94107, États-Unis<br />
            GitHub Pages —
            <a class="link-accent" href="https://github.com" target="_blank" rel="noopener">github.com</a><br />
            Politique de confidentialité :
            <a
              class="link-accent"
              href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement"
              target="_blank"
              rel="noopener"
            >GitHub Privacy Statement</a>
          </p>
        </section>

        <section>
          <h2>Propriété intellectuelle</h2>
          <p>
            © 2026 Roberto Arce. Tous droits réservés. Les textes, visuels, code et projets
            présentés sur ce site sont protégés par le droit d'auteur. Toute reproduction ou
            réutilisation substantielle sans autorisation écrite est interdite.
          </p>
          <p>
            Les noms de sociétés, produits et marques cités (notamment Sanofi, L'Oréal, Disney,
            BlaBlaCar, Deezer, Groupe SEB, Station F, Snowflake, Amazon Web Services et Anthropic)
            appartiennent à leurs propriétaires respectifs. Ils sont utilisés à titre
            d'identification et de description factuelle uniquement ; aucune affiliation, approbation
            ou partenariat n'est sous-entendu. « App Store » est une marque d'Apple Inc.
          </p>
        </section>

        <section>
          <h2>Données personnelles et cookies</h2>
          <p>
            Ce site ne dépose aucun cookie publicitaire, analytique ou de suivi et ne vend aucune
            donnée. Les données techniques traitées par l'hébergeur et par les services tiers
            sollicités (uniquement si vous utilisez le chatbot) sont décrites dans la
            <router-link class="link-accent" to="/privacy">politique de confidentialité</router-link>.
          </p>
        </section>

        <section>
          <h2>Liens externes</h2>
          <p>
            Ce site contient des liens vers des sites tiers (GitHub, LinkedIn, App Store, Wakatto,
            HuggingFace). Je ne contrôle pas leur contenu et décline toute responsabilité quant à
            leurs pratiques ou à leur disponibilité.
          </p>
        </section>

        <section>
          <h2>Droit applicable</h2>
          <p>
            Les présentes mentions sont soumises au droit français. Tout litige relève des tribunaux
            compétents de Paris, sous réserve des règles impératives applicables aux consommateurs.
          </p>
        </section>

        <p class="text-xs text-faint">Dernière mise à jour : 20 octobre 2026.</p>

        <hr class="border-line" />

        <section>
          <h2>English translation</h2>
          <p>
            <strong>Publisher:</strong> Roberto Arce, Paris, France —
            <a class="link-accent" href="mailto:roberto_arce_@hotmail.com">roberto_arce_@hotmail.com</a>.
            Publication director: Roberto Arce.
          </p>
          <p>
            <strong>Host:</strong> GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA
            94107, USA — GitHub Pages. See the
            <a
              class="link-accent"
              href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement"
              target="_blank"
              rel="noopener"
            >GitHub Privacy Statement</a>.
          </p>
          <p>
            <strong>Intellectual property:</strong> © 2026 Roberto Arce. All rights reserved. Company
            and product names are trademarks of their respective owners and are used for factual
            identification only; no endorsement is implied. “App Store” is a trademark of Apple Inc.
          </p>
          <p>
            <strong>Personal data and cookies:</strong> this site sets no advertising, analytics or
            tracking cookies and sells no data. See the
            <router-link class="link-accent" to="/privacy">privacy policy</router-link>.
          </p>
          <p>
            <strong>External links:</strong> third-party sites are not under my control; I am not
            responsible for their content or practices.
          </p>
          <p>
            <strong>Governing law:</strong> French law; the courts of Paris have jurisdiction,
            subject to mandatory consumer protections.
          </p>
        </section>
      </div>
    </article>
  </div>
</template>

<script>
export default {
  name: 'LegalNotice',
};
</script>
