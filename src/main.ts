interface NavLink {
    href: string;
    label: string;
}

interface ProjectCard {
    title: string;
    description: string;
}

interface ContactFormValues {
    name: string;
    email: string;
    message: string;
}

interface FormField {
    name: keyof ContactFormValues;
    label: string;
    validator: (value: string) => string | null;
}

const navLinks: NavLink[] = [
    { href: '#about', label: 'About' },
    { href: '#projects', label: 'Projects' },
    { href: '#skills', label: 'Skills' },
    { href: '#contact', label: 'Contact' }
];

const projectCards: ProjectCard[] = [
    { title: 'Portfolio Platform', description: 'Created a modular portfolio experience with animated transitions and a mobile-first layout.' },
    { title: 'Analytics Dashboard', description: 'Built a data-focused UI with reusable components and clear interaction patterns.' },
    { title: 'Product Landing Page', description: 'Delivered a conversion-driven landing page with strong typography and accessibility.' }
];

const formFields: FormField[] = [
    {
        name: 'name',
        label: 'Name',
        validator: (value: string) => (value.trim().length >= 2 ? null : 'Name must be at least 2 characters long.')
    },
    {
        name: 'email',
        label: 'Email',
        validator: (value: string) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : 'Please enter a valid email address.')
    },
    {
        name: 'message',
        label: 'Message',
        validator: (value: string) => (value.trim().length >= 10 ? null : 'Please share a little more detail.')
    }
];

function setupSmoothScrolling(): void {
    const links = document.querySelectorAll<HTMLAnchorElement>('[data-smooth-scroll]');

    links.forEach((link: HTMLAnchorElement) => {
        link.addEventListener('click', (event: Event) => {
            const targetId = link.getAttribute('href');
            if (!targetId || targetId.startsWith('#') === false) {
                return;
            }

            event.preventDefault();
            const target = document.querySelector<HTMLElement>(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

function setupNavigationHighlight(): void {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('main section[id]'));
    const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('.nav-links a'));

    const observer = new IntersectionObserver(
        (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry: IntersectionObserverEntry) => {
                if (entry.isIntersecting) {
                    links.forEach((link: HTMLAnchorElement) => {
                        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
                    });
                }
            });
        },
        { threshold: 0.5 }
    );

    sections.forEach((section: HTMLElement) => observer.observe(section));
}

function setupMobileMenu(): void {
    const toggleButton = document.querySelector<HTMLButtonElement>('.menu-toggle');
    const navMenu = document.querySelector<HTMLElement>('[data-nav-menu]');

    if (!toggleButton || !navMenu) {
        return;
    }

    toggleButton.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('open');
        toggleButton.setAttribute('aria-expanded', String(isOpen));
    });
}

function setupFormValidation(): void {
    const form = document.querySelector<HTMLFormElement>('#contactForm');
    const statusMessage = document.querySelector<HTMLElement>('.form-status');

    if (!form || !statusMessage) {
        return;
    }

    form.addEventListener('submit', (event: Event) => {
        event.preventDefault();

        const values: ContactFormValues = {
            name: (form.elements.namedItem('name') as HTMLInputElement | null)?.value ?? '',
            email: (form.elements.namedItem('email') as HTMLInputElement | null)?.value ?? '',
            message: (form.elements.namedItem('message') as HTMLTextAreaElement | null)?.value ?? ''
        };

        const errors = formFields
            .map((field: FormField) => ({ field, error: field.validator(values[field.name]) }))
            .filter((entry) => entry.error !== null);

        if (errors.length > 0) {
            statusMessage.textContent = errors[0]?.error ?? 'Please correct the highlighted fields.';
            return;
        }

        statusMessage.textContent = `Thanks, ${values.name}! Your message is ready to send.`;
        form.reset();
    });
}

function renderProjectCards(): void {
    const cardGrid = document.querySelector<HTMLElement>('.card-grid');
    if (!cardGrid) {
        return;
    }

    cardGrid.innerHTML = projectCards
        .map((project: ProjectCard) => `
      <article class="card">
        <h3>${project.title}</h3>
        <p>${project.description}</p>
      </article>
    `)
        .join('');
}

function init(): void {
    setupSmoothScrolling();
    setupNavigationHighlight();
    setupMobileMenu();
    setupFormValidation();
    renderProjectCards();

    const navMarkup = navLinks.map((link: NavLink) => `<a href="${link.href}" data-smooth-scroll>${link.label}</a>`).join('');
    const navMenu = document.querySelector<HTMLElement>('[data-nav-menu]');
    if (navMenu) {
        navMenu.innerHTML = navMarkup;
    }
}

document.addEventListener('DOMContentLoaded', init);
