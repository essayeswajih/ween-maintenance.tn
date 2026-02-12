--
-- PostgreSQL database dump
--

\restrict pDXwZVcKbFAdc53mYHBpZusQjOlaP98fhdrLSNeJ0dbYR9aqrLp2WLEXX0DtT8f

-- Dumped from database version 16.11 (Debian 16.11-1.pgdg13+1)
-- Dumped by pg_dump version 17.7 (Debian 17.7-0+deb13u1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: orderstatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.orderstatus AS ENUM (
    'PENDING',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED'
);


ALTER TYPE public.orderstatus OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: blogs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.blogs (
    id integer NOT NULL,
    title character varying NOT NULL,
    content text NOT NULL,
    category character varying,
    author character varying,
    image_url text,
    slug character varying NOT NULL,
    views integer,
    status character varying,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    excerpt text,
    read_time character varying DEFAULT '5 min'::character varying
);


ALTER TABLE public.blogs OWNER TO postgres;

--
-- Name: blogs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.blogs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.blogs_id_seq OWNER TO postgres;

--
-- Name: blogs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.blogs_id_seq OWNED BY public.blogs.id;


--
-- Name: cart_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_items (
    id integer NOT NULL,
    user_id integer,
    product_id integer,
    quantity integer NOT NULL
);


ALTER TABLE public.cart_items OWNER TO postgres;

--
-- Name: cart_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cart_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cart_items_id_seq OWNER TO postgres;

--
-- Name: cart_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cart_items_id_seq OWNED BY public.cart_items.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying NOT NULL,
    description character varying,
    image_url text
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: subcategories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subcategories (
    id integer NOT NULL,
    name character varying NOT NULL,
    description character varying,
    image_url text,
    slug character varying NOT NULL,
    category_id integer NOT NULL
);

ALTER TABLE public.subcategories OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;

--
-- Name: subcategories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.subcategories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.subcategories_id_seq OWNER TO postgres;
ALTER SEQUENCE public.subcategories_id_seq OWNED BY public.subcategories.id;


--
-- Name: categories_service; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories_service (
    id integer NOT NULL,
    name character varying NOT NULL,
    description character varying,
    image_url text,
    slug character varying NOT NULL
);


ALTER TABLE public.categories_service OWNER TO postgres;

--
-- Name: categories_service_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_service_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_service_id_seq OWNER TO postgres;

--
-- Name: categories_service_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_service_id_seq OWNED BY public.categories_service.id;


--
-- Name: freelancers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.freelancers (
    id integer NOT NULL,
    user_id integer,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    username character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    tel character varying(20),
    website character varying(255),
    title character varying(255),
    bio text,
    skills json,
    services json,
    experience_years integer,
    hourly_rate double precision,
    address character varying(255),
    city character varying(100),
    country character varying(100),
    matricule_fiscale character varying(100),
    cin character varying(20),
    verified boolean,
    is_active boolean,
    rating double precision,
    reviews_count integer,
    avatar character varying(255),
    cover_image character varying(255),
    notes text,
    blocked_reason text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone
);


ALTER TABLE public.freelancers OWNER TO postgres;

--
-- Name: freelancers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.freelancers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.freelancers_id_seq OWNER TO postgres;

--
-- Name: freelancers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.freelancers_id_seq OWNED BY public.freelancers.id;


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_items (
    id integer NOT NULL,
    order_id integer,
    product_id integer,
    quantity integer NOT NULL,
    price double precision NOT NULL,
    name character varying,
    color character varying,
    size character varying
);


ALTER TABLE public.order_items OWNER TO postgres;

--
-- Name: order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_items_id_seq OWNER TO postgres;

--
-- Name: order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    total_amount double precision NOT NULL,
    status public.orderstatus,
    created_at timestamp without time zone,
    username character varying NOT NULL,
    email character varying NOT NULL,
    telephone character varying NOT NULL,
    location character varying NOT NULL,
    payment_method character varying NOT NULL,
    payed character varying,
    code character varying NOT NULL
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_id_seq OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name character varying NOT NULL,
    description text,
    price double precision NOT NULL,
    discounted_price double precision,
    stock_quantity integer NOT NULL,
    category_id integer,
    image_url text,
    image2_url text,
    image3_url text,
    image4_url text,
    sizes json,
    colors json,
    materials json,
    care json,
    features json,
    sku character varying,
    promo boolean,
    buzzent text,
    rating double precision,
    num_ratings integer,
    in_stock boolean,
    slug character varying NOT NULL,
    supplier_id integer,
    subcategory_id integer
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: quotation_proposals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.quotation_proposals (
    id integer NOT NULL,
    quotation_id integer NOT NULL,
    freelancer_id integer NOT NULL,
    price double precision NOT NULL,
    message text,
    status character varying(50),
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.quotation_proposals OWNER TO postgres;

--
-- Name: quotation_proposals_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.quotation_proposals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.quotation_proposals_id_seq OWNER TO postgres;

--
-- Name: quotation_proposals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.quotation_proposals_id_seq OWNED BY public.quotation_proposals.id;


--
-- Name: quotations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.quotations (
    id integer NOT NULL,
    service_id integer NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(30) NOT NULL,
    address character varying(255) NOT NULL,
    city character varying(100) NOT NULL,
    postal_code character varying(20),
    description text NOT NULL,
    preferred_timeline character varying(50),
    status character varying(50),
    selected_proposal_id integer,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone
);


ALTER TABLE public.quotations OWNER TO postgres;

--
-- Name: quotations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.quotations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.quotations_id_seq OWNER TO postgres;

--
-- Name: quotations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.quotations_id_seq OWNED BY public.quotations.id;


--
-- Name: ratings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ratings (
    id integer NOT NULL,
    user_id integer NOT NULL,
    rating integer NOT NULL,
    comment text,
    service_id integer,
    product_id integer,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT rating_range CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.ratings OWNER TO postgres;

--
-- Name: ratings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ratings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ratings_id_seq OWNER TO postgres;

--
-- Name: ratings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ratings_id_seq OWNED BY public.ratings.id;


--
-- Name: services; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.services (
    id integer NOT NULL,
    name character varying NOT NULL,
    description text,
    price double precision NOT NULL,
    specialties character varying,
    disponiblity text,
    "moyDuration" double precision NOT NULL,
    category_id integer,
    image_url text,
    slug character varying NOT NULL,
    price_unit character varying,
    features json,
    process json,
    rating double precision,
    num_ratings integer
);


ALTER TABLE public.services OWNER TO postgres;

--
-- Name: services_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.services_id_seq OWNER TO postgres;

--
-- Name: services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.services_id_seq OWNED BY public.services.id;


--
-- Name: settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.settings (
    id integer NOT NULL,
    store_name character varying,
    email character varying,
    phone character varying,
    address character varying,
    shipping_cost double precision,
    free_shipping_threshold double precision,
    tax_rate double precision,
    currency character varying
);


ALTER TABLE public.settings OWNER TO postgres;

--
-- Name: settings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.settings_id_seq OWNER TO postgres;

--
-- Name: settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.settings_id_seq OWNED BY public.settings.id;


--
-- Name: site; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.site (
    id integer NOT NULL,
    name character varying NOT NULL,
    email character varying NOT NULL,
    phone character varying,
    address text,
    city character varying,
    country character varying,
    shipping_cost double precision NOT NULL,
    free_shipping_threshold double precision NOT NULL,
    tax_rate double precision NOT NULL,
    currency character varying NOT NULL
);


ALTER TABLE public.site OWNER TO postgres;

--
-- Name: site_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.site_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.site_id_seq OWNER TO postgres;

--
-- Name: site_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.site_id_seq OWNED BY public.site.id;


--
-- Name: suppliers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.suppliers (
    id integer NOT NULL,
    owner_name character varying,
    company_name character varying(255) NOT NULL,
    matricule_fiscale character varying,
    forme_juridique character varying,
    site character varying(255),
    email character varying(255),
    tel character varying(20),
    main_category character varying(100),
    services json,
    address character varying(255),
    city character varying(100),
    country character varying(100),
    verified boolean,
    is_active boolean,
    notes text,
    blocked_reason text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone
);


ALTER TABLE public.suppliers OWNER TO postgres;

--
-- Name: suppliers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.suppliers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.suppliers_id_seq OWNER TO postgres;

--
-- Name: suppliers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.suppliers_id_seq OWNED BY public.suppliers.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying,
    full_name character varying,
    email character varying NOT NULL,
    phone character varying,
    hashed_password character varying NOT NULL,
    role character varying,
    two_factor_enabled integer
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: blogs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blogs ALTER COLUMN id SET DEFAULT nextval('public.blogs_id_seq'::regclass);


--
-- Name: cart_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items ALTER COLUMN id SET DEFAULT nextval('public.cart_items_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);

--
-- Name: subcategories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subcategories ALTER COLUMN id SET DEFAULT nextval('public.subcategories_id_seq'::regclass);


--
-- Name: categories_service id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories_service ALTER COLUMN id SET DEFAULT nextval('public.categories_service_id_seq'::regclass);


--
-- Name: freelancers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.freelancers ALTER COLUMN id SET DEFAULT nextval('public.freelancers_id_seq'::regclass);


--
-- Name: order_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: quotation_proposals id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quotation_proposals ALTER COLUMN id SET DEFAULT nextval('public.quotation_proposals_id_seq'::regclass);


--
-- Name: quotations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quotations ALTER COLUMN id SET DEFAULT nextval('public.quotations_id_seq'::regclass);


--
-- Name: ratings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ratings ALTER COLUMN id SET DEFAULT nextval('public.ratings_id_seq'::regclass);


--
-- Name: services id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services ALTER COLUMN id SET DEFAULT nextval('public.services_id_seq'::regclass);


--
-- Name: settings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.settings ALTER COLUMN id SET DEFAULT nextval('public.settings_id_seq'::regclass);


--
-- Name: site id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.site ALTER COLUMN id SET DEFAULT nextval('public.site_id_seq'::regclass);


--
-- Name: suppliers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suppliers ALTER COLUMN id SET DEFAULT nextval('public.suppliers_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: blogs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.blogs (id, title, content, category, author, image_url, slug, views, status, created_at, updated_at, excerpt, read_time) FROM stdin;
3	Maintenance de la plomberie : conseils essentiels pour éviter les dégâts d’eau	<p>\nUne plomberie bien entretenue est essentielle pour garantir le confort de votre logement\net prévenir les dégâts d’eau. Les fuites, les bouchons ou l’usure des installations peuvent\nentraîner des réparations coûteuses si elles ne sont pas détectées à temps. Voici les bonnes\npratiques pour maintenir votre système de plomberie en excellent état.\n</p>\n\n<h2>🔧 L’importance de la maintenance régulière</h2>\n<p>\nLa maintenance de la plomberie permet d’anticiper les problèmes avant qu’ils ne deviennent\ngraves. Des contrôles réguliers vous aident à prolonger la durée de vie de vos installations\net à éviter des interventions d’urgence coûteuses.\n</p>\n\n<h2>💧 Vérifiez régulièrement les fuites</h2>\n<p>\nInspectez fréquemment les robinets, les tuyaux et les raccords visibles. Une petite fuite,\nmême minime, peut rapidement se transformer en dégât des eaux important et endommager\nles murs, les sols et les meubles.\n</p>\n\n<h2>🚿 Nettoyage des siphons</h2>\n<p>\nLes siphons des éviers, lavabos et douches doivent être nettoyés régulièrement pour éviter\nles bouchons et les mauvaises odeurs. Un entretien simple permet de garantir un bon\nécoulement de l’eau et d’éviter les interventions lourdes.\n</p>\n\n<h2>🛡️ Prévention : la clé d’une plomberie durable</h2>\n<p>\nAdopter de bons réflexes au quotidien, comme éviter de jeter des déchets dans les canalisations\net surveiller la pression de l’eau, contribue à maintenir une plomberie saine et fonctionnelle.\n</p>\n\n<h2>👷‍♂️ Faites appel à Ween Maintenance</h2>\n<p>\nChez <strong>Ween Maintenance</strong>, nous proposons des services de maintenance et de dépannage\nen plomberie partout en Tunisie. Nos experts vous accompagnent pour prévenir les dégâts\nd’eau et assurer le bon fonctionnement de vos installations.\n</p>\n\n<p>\n<strong>Un doute ou une fuite ?</strong><br>\n<a href="/services/request">Demandez une intervention plomberie dès maintenant</a>\n</p>\n	Plomberie	Ween Maintenance	💧	maintenance-plomberie-eviter-degats-eau	0	Publié	2026-02-04 20:29:58.217439+00	2026-02-05 16:16:03.539968+00	Découvrez comment maintenir votre système de plomberie en excellent état et éviter les dégâts d’eau grâce à des gestes simples et efficaces recommandés par des professionnels.	6 min
7	Rénovation électrique : guide complet pour une installation sûre et conforme	<p>\nLa rénovation de l’installation électrique est une étape essentielle pour garantir la sécurité\nde votre logement. Une installation ancienne ou non conforme peut provoquer des pannes,\ndes électrocutions ou des incendies. Ce guide vous aide à comprendre les étapes clés pour\nrénover votre électricité en toute sérénité.\n</p>\n\n<h2>🔍 Diagnostic de l’installation existante</h2>\n<p>\nAvant toute rénovation, il est indispensable de réaliser un diagnostic électrique complet.\nCe contrôle, effectué par un professionnel, permet d’identifier les défauts, les risques\npotentiels et les éléments à remplacer pour respecter les normes de sécurité.\n</p>\n\n<h2>📝 Planification des besoins actuels et futurs</h2>\n<p>\nLa planification est une étape souvent négligée, pourtant essentielle. Pensez à vos besoins\nactuels mais aussi futurs :\n</p>\n<ul>\n  <li>Ajout de prises électriques</li>\n  <li>Installation de systèmes domotiques</li>\n  <li>Borne de recharge pour véhicule électrique</li>\n  <li>Équipements énergivores supplémentaires</li>\n</ul>\n<p>\nUne bonne anticipation évite des travaux coûteux à long terme.\n</p>\n\n<h2>⚡ Mise aux normes et sécurisation</h2>\n<p>\nLa rénovation électrique implique la mise aux normes du tableau électrique, l’installation\nde disjoncteurs différentiels, une mise à la terre efficace et l’utilisation de matériaux\ncertifiés. Ces éléments garantissent une protection optimale des personnes et des biens.\n</p>\n\n<h2>🛠️ Pourquoi confier votre rénovation électrique à un professionnel ?</h2>\n<p>\nLes travaux électriques nécessitent un savoir-faire spécifique. Faire appel à un professionnel\npermet d’assurer :\n</p>\n<ul>\n  <li>Une installation conforme aux normes en vigueur</li>\n  <li>Une sécurité maximale</li>\n  <li>Un gain de temps et de tranquillité</li>\n  <li>Des conseils personnalisés</li>\n</ul>\n\n<h2>👷‍♂️ Ween Maintenance, votre partenaire sécurité</h2>\n<p>\nChez <strong>Ween Maintenance</strong>, nous réalisons des rénovations électriques complètes,\ndu diagnostic à la mise en service, partout en Tunisie. Nos experts vous accompagnent pour\nsécuriser et moderniser votre installation.\n</p>\n\n<p>\n<strong>Besoin d’un diagnostic ou d’une rénovation électrique ?</strong><br>\n<a href="/services/request">Demandez une intervention dès maintenant</a>\n</p>\n	Électricité	Ween Maintenance	🔌	renovation-installation-electrique-guide-complet	0	Publié	2026-02-04 20:29:58.217439+00	2026-02-05 16:12:14.538493+00	Guide complet pour rénover l’installation électrique de votre domicile en toute sécurité. Diagnostic, planification et bonnes pratiques pour une installation conforme et durable.	10 min
4	Sécurité électrique : les normes essentielles pour protéger votre maison	<p>\nL’électricité est indispensable au quotidien, mais une installation électrique non conforme\nreprésente un réel danger. En Tunisie, de nombreux accidents domestiques sont causés par des\nproblèmes électriques évitables. Respecter les normes de sécurité électrique permet de protéger\nvotre maison, votre famille et vos appareils.\n</p>\n\n<h2>⚡ Normes fondamentales de sécurité électrique</h2>\n<p>\nLa sécurité électrique n’est jamais une option. Une installation conforme réduit considérablement\nles risques d’électrocution et d’incendie. Les normes exigent notamment :\n</p>\n<ul>\n  <li>Une mise à la terre efficace</li>\n  <li>Des câbles adaptés à la puissance utilisée</li>\n  <li>Des protections contre les surcharges</li>\n  <li>Un tableau électrique bien organisé et identifié</li>\n</ul>\n\n<h2>🔌 Le tableau électrique : le cœur de votre installation</h2>\n<p>\nLe tableau électrique est l’élément central de votre installation. Il doit obligatoirement être\néquipé de disjoncteurs différentiels afin de couper automatiquement le courant en cas de danger.\nUn tableau ancien ou mal entretenu augmente fortement les risques électriques.\n</p>\n\n<p>\nSi votre logement a plus de 10 ans, un contrôle du tableau électrique par un professionnel est\nfortement recommandé.\n</p>\n\n<h2>⚠️ Les dangers du bricolage électrique</h2>\n<p>\nLe bricolage électrique est l’une des principales causes d’accidents domestiques. Intervenir sur\nune installation sous tension peut entraîner des blessures graves, voire mortelles.\n</p>\n<p>\nAvant toute intervention :\n</p>\n<ul>\n  <li>Coupez toujours le courant au disjoncteur principal</li>\n  <li>N’utilisez jamais du matériel de mauvaise qualité</li>\n  <li>Ne surchargez pas les prises et multiprises</li>\n</ul>\n\n<h2>🧯 Bonnes pratiques pour une sécurité durable</h2>\n<p>\nPour garantir une sécurité électrique optimale :\n</p>\n<ul>\n  <li>Faites vérifier votre installation régulièrement</li>\n  <li>Remplacez les équipements vétustes</li>\n  <li>Installez des protections modernes</li>\n  <li>Faites appel à un électricien professionnel</li>\n</ul>\n\n<h2>👷‍♂️ Pourquoi faire confiance à Ween Maintenance ?</h2>\n<p>\nWeen Maintenance vous accompagne pour tous vos besoins en électricité :\n</p>\n<ul>\n  <li>Diagnostic électrique complet</li>\n  <li>Mise aux normes électriques</li>\n  <li>Dépannage rapide et sécurisé</li>\n  <li>Interventions partout en Tunisie</li>\n</ul>\n\n<p>\n<strong>Besoin d’un contrôle ou d’une intervention électrique ?</strong><br>\n<a href="/services/request">Demandez un service électrique dès maintenant</a>\n</p>	Électricité	Ween Maintenance	⚡	securite-electrique-normes-essentielles-maison	0	Publié	2026-02-04 20:29:58.217439+00	2026-02-05 16:14:08.335989+00	Les normes de sécurité électrique sont essentielles pour protéger votre maison, votre famille et vos équipements. Découvrez les bonnes pratiques et les erreurs à éviter pour une installation électrique sûre et conforme en Tunisie.	7 min
6	Installation d’une chaudière : les erreurs à éviter absolument	<p>\nL’installation d’une chaudière est une étape cruciale pour garantir le confort thermique\net la sécurité de votre logement. Une mauvaise installation peut entraîner une surconsommation\nd’énergie, des pannes fréquentes et des risques pour la sécurité. Voici les erreurs les plus\ncourantes à éviter lors de l’installation d’une chaudière moderne.\n</p>\n\n<h2>⚠️ Choisir une chaudière mal adaptée</h2>\n<p>\nUne chaudière surdimensionnée ou sous-dimensionnée entraîne une consommation excessive\net une usure prématurée. Il est essentiel de choisir un modèle adapté à la surface du logement,\nau nombre d’occupants et au niveau d’isolation.\n</p>\n\n<h2>🔧 Négliger l’installation professionnelle</h2>\n<p>\nInstaller une chaudière sans l’intervention d’un professionnel qualifié est une erreur\nfréquente. Une installation incorrecte peut provoquer des fuites, un mauvais tirage ou un\nfonctionnement inefficace de l’appareil.\n</p>\n\n<h2>💨 Mauvaise ventilation du local</h2>\n<p>\nUne chaudière a besoin d’une ventilation adéquate pour fonctionner en toute sécurité.\nUn manque d’aération peut entraîner une accumulation de gaz dangereux et réduire les\nperformances de l’appareil.\n</p>\n\n<h2>🧯 Oublier les dispositifs de sécurité</h2>\n<p>\nSoupapes de sécurité, détecteurs de gaz et systèmes de coupure automatique sont indispensables.\nLeur absence expose le logement à des risques graves.\n</p>\n\n<h2>🛠️ Négliger l’entretien régulier</h2>\n<p>\nMême une chaudière moderne nécessite un entretien périodique. Un entretien régulier permet\nd’optimiser les performances, de réduire la consommation d’énergie et de prolonger la durée\nde vie de l’équipement.\n</p>\n\n<h2>👷‍♂️ Pourquoi faire appel à Ween Maintenance ?</h2>\n<p>\nChez <strong>Ween Maintenance</strong>, nous assurons :\n</p>\n<ul>\n  <li>Installation professionnelle de chaudières</li>\n  <li>Conseils personnalisés selon votre logement</li>\n  <li>Mise en service sécurisée</li>\n  <li>Entretien et dépannage rapide</li>\n</ul>\n\n<p>\n<strong>Besoin d’une installation fiable et sécurisée ?</strong><br>\n<a href="/services/request">Demandez votre installation de chaudière dès maintenant</a>\n</p>\n	Chaudières	Ween Maintenance	🔥⚠️	installation-chaudiere-erreurs-a-eviter	0	Publié	2026-02-04 20:29:58.217439+00	2026-02-05 16:12:54.537103+00	Évitez les pièges et les erreurs fréquentes lors de l’installation d’une chaudière moderne. Découvrez les bonnes pratiques pour une installation sécurisée, performante et durable.	9 min
2	Guide complet d'installation de chauffage	\n                    <h2>Introduction</h2>\n                    <p>L'installation d'un système de chauffage est une étape cruciale pour le confort de votre maison. Ce guide vous accompagne à travers les étapes essentielles.</p>\n                    <h2>Étapes de préparation</h2>\n                    <p>Avant de commencer, assurez-vous d'avoir réalisé un bilan thermique de votre habitation. Cela vous permettra de choisir la puissance adaptée.</p>\n                    <h2>Choix du système</h2>\n                    <p>Chaudière gaz, pompe à chaleur ou radiateurs électriques ? Le choix dépend de votre isolation, de votre budget et de vos préférences écologiques.</p>\n                    <h2>Installation et Sécurité</h2>\n                    <p>Faites toujours appel à un professionnel certifié pour l'installation. Les normes de sécurité, notamment pour le gaz et l'électricité, sont strictes.</p>\n                    <h2>Conclusion</h2>\n                    <p>Une bonne installation garantit performance et économies d'énergie sur le long terme.</p>\n                    	Chauffage	Ween Maintenance	🔥	guide-complet-dinstallation-de-chauffage	0	Publié	2026-02-04 20:29:58.217439+00	2026-02-05 16:13:35.732868+00	Apprenez les étapes essentielles pour installer un système de chauffage professionnel dans votre maison.	8 min
5	Comment réduire votre consommation d’énergie grâce au chauffage intelligent	<p>\nLe chauffage représente une part importante de la consommation d’énergie dans les foyers.\nUne mauvaise utilisation peut rapidement faire grimper la facture. Heureusement, quelques\najustements simples permettent de réaliser des économies significatives tout en conservant\nun excellent confort thermique.\n</p>\n\n<h2>🌡️ Programmation du chauffage</h2>\n<p>\nL’installation d’un thermostat programmable est l’une des solutions les plus efficaces pour\nréduire votre consommation d’énergie. En programmant la baisse de température lorsque vous\nêtes absent ou pendant la nuit, vous pouvez réduire votre facture de chauffage jusqu’à\n<strong>15&nbsp;%</strong>.\n</p>\n<p>\nUn chauffage intelligent s’adapte à votre rythme de vie et évite de chauffer inutilement\nles pièces inoccupées.\n</p>\n\n<h2>🏠 Température idéale pour chaque pièce</h2>\n<p>\nMaintenir une température adaptée est essentiel pour le confort et la santé :\n</p>\n<ul>\n  <li><strong>19&nbsp;°C</strong> dans les pièces à vivre</li>\n  <li><strong>16&nbsp;°C</strong> dans les chambres</li>\n</ul>\n<p>\nChaque degré supplémentaire augmente la consommation d’énergie d’environ 7&nbsp;%. Trouver\nle bon équilibre permet donc de réduire les coûts sans sacrifier le bien-être.\n</p>\n\n<h2>💡 Astuces pour optimiser votre chauffage</h2>\n<ul>\n  <li>Fermez les volets la nuit pour conserver la chaleur</li>\n  <li>Entretenez régulièrement votre système de chauffage</li>\n  <li>Évitez de couvrir les radiateurs</li>\n  <li>Améliorez l’isolation de votre logement</li>\n</ul>\n\n<h2>👷‍♂️ Faites appel à un professionnel</h2>\n<p>\nUn diagnostic énergétique réalisé par un professionnel permet d’identifier les sources de\ndéperdition de chaleur et d’optimiser votre installation. Chez <strong>Ween Maintenance</strong>,\nnous vous accompagnons pour améliorer l’efficacité énergétique de votre logement.\n</p>\n\n<p>\n<a href="/services/request">Demandez un diagnostic ou une intervention chauffage</a>\n</p>\n	Chauffage	Mariem Khamis	🔥🌡️💡	reduction-consommation-energie-chauffage-intelligent	0	Publié	2026-02-04 20:29:58.217439+00	2026-02-05 16:14:57.058521+00	Réduisez votre consommation d’énergie et votre facture de chauffage en utilisant intelligemment votre système de chauffage. Découvrez les bonnes pratiques pour un confort optimal et des économies durables.	5 min
\.


--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_items (id, user_id, product_id, quantity) FROM stdin;
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, name, description, image_url) FROM stdin;
1	Chauffage	Équipements de chauffage	heating.jpg
2	Plomberie	Matériel de plomberie	plumbing.jpg
3	Électricité	Matériel électrique	electric.jpg
\.


--
-- Data for Name: categories_service; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories_service (id, name, description, image_url, slug) FROM stdin;
1	Plomberie	Plomberie	💧	plomberie
2	Électricité	Électricité	⚡	électricité
3	Industrue	Industrue	🏭	industrue
4	contrôle et securité industrielles	contrôle réglementaires périodiques de securié industrielles	🛡️	contrôle-et-securité-industrielles-a-tunis
\.


--
-- Data for Name: freelancers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.freelancers (id, user_id, first_name, last_name, username, email, tel, website, title, bio, skills, services, experience_years, hourly_rate, address, city, country, matricule_fiscale, cin, verified, is_active, rating, reviews_count, avatar, cover_image, notes, blocked_reason, created_at, updated_at) FROM stdin;
2	\N	salah	zaafrani	salah_zaafrani	salah@gmail.com	275553981		Electricien	dqsdqsd	["Electricit\\u00e9"]	["Installation"]	5	50	monastir	Benbla	Tunisia			t	t	0	0	\N	\N	khadem		2026-02-05 21:38:30.914158+00	2026-02-05 21:49:23.558707+00
3	\N	kamel	salah	kamel-salah	kamel@gmail.com	22245539		plembier expert		[]	["electricit\\u00e9"]	0	\N			Tunisia		55445	t	t	0	0					2026-02-06 12:30:28.570946+00	2026-02-06 12:30:39.178206+00
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_items (id, order_id, product_id, quantity, price, name, color, size) FROM stdin;
5	5	3	1	59.99	\N	\N	\N
6	6	4	1	199.99	\N	\N	\N
7	6	3	1	59.99	\N	\N	\N
8	6	2	1	89.5	\N	\N	\N
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, total_amount, status, created_at, username, email, telephone, location, payment_method, payed, code) FROM stdin;
5	83.38810000000001	PENDING	2026-02-07 17:10:18.512932	Admin Wajih	wajihsayes@gmail.com	27553981	rue el yassamin, benbla, Tunis 5021	delivery	check	74109-76476-23615-11928
6	415.88120000000004	PENDING	2026-02-07 17:20:43.824355	Admin Wajih	wajihsayes@gmail.com	27553981	rue el yassamin, benbla, Tunis 5021	delivery	check	47387-71360-35220-22629
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, name, description, price, discounted_price, stock_quantity, category_id, image_url, image2_url, image3_url, image4_url, sizes, colors, materials, care, features, sku, promo, buzzent, rating, num_ratings, in_stock, slug, supplier_id) FROM stdin;
2	Tuyauterie Cuivre 22mm	Tuyau en cuivre haute qualité pour plomberie.	89.5	\N	99	2	https://www.richardson.fr/files/richardson/styles/1184x608_resize/public/media/product_categories/2021-10/N2-tube-cuivre-et-laiton.jpg?itok=ai6Mo2rI	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	4.9	95	t	tuyauterie-cuivre-22mm	\N
3	Câble Électrique 2.5mm²	Rouleau de 100m de câble électrique standard.	59.99	\N	197	3	https://cdn.manomano.com/rs-pro-conduit-section-4-mm-100m-450-750-v-32-a-bleu-h07v-u-h07v-u-prix-pour-bobine-de-100-metres-P-1801662-11545406_1.jpg	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	4.7	156	t	câble-électrique-2.5mm²	\N
4	Thermostat Intelligent WiFi	Contrôlez votre chauffage depuis votre smartphone.	199.99	\N	24	1	https://m.media-amazon.com/images/I/614D92e-JVL._AC_SL1500_.jpg	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	4.9	203	t	thermostat-intelligent-wifi	\N
\.


--
-- Data for Name: quotation_proposals; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.quotation_proposals (id, quotation_id, freelancer_id, price, message, status, created_at) FROM stdin;
1	1	2	0	Invited by Admin	PENDING	2026-02-06 12:22:07.108839+00
2	1	3	0	Invited by Admin	PENDING	2026-02-06 12:30:48.392008+00
\.


--
-- Data for Name: quotations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.quotations (id, service_id, first_name, last_name, email, phone, address, city, postal_code, description, preferred_timeline, status, selected_proposal_id, created_at, updated_at) FROM stdin;
1	1	baccar	sahbi	wajihsayes@gmail.com	27553981	tunise	monastir	1000	wajihsayes@gmail.com	Urgent (1-2 jours)	OPEN	\N	2026-02-06 12:14:41.964761+00	2026-02-06 12:30:48.392008+00
\.


--
-- Data for Name: ratings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ratings (id, user_id, rating, comment, service_id, product_id, created_at) FROM stdin;
20	1	5	TOP	1	\N	2026-02-03 20:54:24.338452+00
\.


--
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.services (id, name, description, price, specialties, disponiblity, "moyDuration", category_id, image_url, slug, price_unit, features, process, rating, num_ratings) FROM stdin;
1	Plomberie d'Urgence	Intervention rapide pour fuites et débouchage.	50	Fuites, Débouchage	Lun-Dim 7h-20h	1	1	💧	plomberie-urgence	intervention	[]	[]	4.8	5
2	Installation Électrique	Installation complète ou rénovation électrique.	100	Rénovation, Neuf	Lun-Dim 7h-20h	5	3	⚡	installation-electrique	intervention	[]	[]	4.6	5
3	Entretien annuel et dépannage chaudière	Service complet d’entretien annuel et dépannage des chaudières, garantissant leur fonctionnement optimal, la sécurité des installations et la réduction des risques de panne. Inclut nettoyage, vérification des composants et interventions correctives si nécessaire.	120	Entretien chaudière, dépannage chaudière, maintenance préventive, sécurité industrielle, vérification équipements	Lun-Dim 7h-20h	3	3	🔧	maintenance-chaudiere	intervention	[]	[{"step": 1, "title": "Prise de rendez-vous et \\u00e9valuation initiale", "description": ""}, {"step": 2, "title": "Inspection compl\\u00e8te de la chaudi\\u00e8re et des syst\\u00e8mes associ\\u00e9s", "description": ""}, {"step": 3, "title": "Nettoyage et maintenance des composants", "description": ""}, {"step": 4, "title": "D\\u00e9tection et r\\u00e9paration des pannes \\u00e9ventuelles", "description": ""}, {"step": 5, "title": "Test final, v\\u00e9rification de s\\u00e9curit\\u00e9 et remise du rapport", "description": ""}]	5	3
4	Contrôle réglementaires périodiques de securié industrielles	Les contrôles réglementaires périodiques de sécurité industrielle assurent la conformité des installations, préviennent les accidents et garantissent la sécurité des employés et équipements.	300	contrôles réglementaires périodiques, inspectionet sécurité industrielle, conformité réglementaire, prévention des risques professionnels, contrôle des installations industrielles, audit de sécurité, maintenance industrielle, sécurité incendie, contrôle des installations électriques, équipements sous pression, protection des travailleurs	7j/7, 24h/24	1	4	🛡️	contrôle-réglementaires-périodiques-de-securié-industrielles	DT/heure	[]	[]	0	0
\.


--
-- Data for Name: settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.settings (id, store_name, email, phone, address, shipping_cost, free_shipping_threshold, tax_rate, currency) FROM stdin;
1	Ween-Maintenance.tn	info@ween-maintenance.tn	+216 27 553 981	Tunis, Tunisie	12	100	19	DT
\.


--
-- Data for Name: site; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.site (id, name, email, phone, address, city, country, shipping_cost, free_shipping_threshold, tax_rate, currency) FROM stdin;
\.


--
-- Data for Name: suppliers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.suppliers (id, owner_name, company_name, matricule_fiscale, forme_juridique, site, email, tel, main_category, services, address, city, country, verified, is_active, notes, blocked_reason, created_at, updated_at) FROM stdin;
1	Samir	IMMI	dqsdsq	dqsdqs	dsqdqs	sdqdqs@gmail.com	275553981	Chaudeiere	["dsqdsqdqsq"]	dsqdsqdsq	dsqdqs	Tunisia	f	t	\N	\N	2026-02-05 13:13:58.903858+00	\N
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, full_name, email, phone, hashed_password, role, two_factor_enabled) FROM stdin;
1	wajihsayes@gmail.com	Admin Wajih	wajihsayes@gmail.com	27553981	$2b$12$XHUBJgUUjDqm7oCcM5vxLOJu2DvoIyyAFFQdF8K8BA27SCLEk73Mm	admin	0
2	wajihsayes1@gmail.com	Mohamed Essayes	wajihsayes1@gmail.com	27553981	$2b$12$GNApVHPEOKxfndPujXQBw.Y5oxyNaZUxbi/crFHajuZB.IXbETkpO	client	0
3	wajihsayes11111@gmail.com	wajih client	wajihsayes11111@gmail.com	27553981	$2b$12$c1GjSB5YjddWj8KJHeMIn.RrzbqYLTJc26W1xHHFchECUsH.bts.2	client	0
\.


--
-- Name: blogs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.blogs_id_seq', 9, true);


--
-- Name: cart_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cart_items_id_seq', 1, false);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 3, true);


--
-- Name: categories_service_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_service_id_seq', 4, true);


--
-- Name: freelancers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.freelancers_id_seq', 3, true);


--
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_items_id_seq', 8, true);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_id_seq', 6, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 4, true);


--
-- Name: quotation_proposals_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.quotation_proposals_id_seq', 2, true);


--
-- Name: quotations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.quotations_id_seq', 1, true);


--
-- Name: ratings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ratings_id_seq', 20, true);


--
-- Name: services_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.services_id_seq', 4, true);


--
-- Name: settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.settings_id_seq', 1, true);


--
-- Name: site_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.site_id_seq', 1, false);


--
-- Name: suppliers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.suppliers_id_seq', 1, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- Name: blogs blogs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blogs
    ADD CONSTRAINT blogs_pkey PRIMARY KEY (id);


--
-- Name: blogs blogs_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blogs
    ADD CONSTRAINT blogs_slug_key UNIQUE (slug);


--
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);


--
-- Name: categories categories_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key UNIQUE (name);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: categories_service categories_service_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories_service
    ADD CONSTRAINT categories_service_name_key UNIQUE (name);


--
-- Name: categories_service categories_service_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories_service
    ADD CONSTRAINT categories_service_pkey PRIMARY KEY (id);


--
-- Name: categories_service categories_service_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories_service
    ADD CONSTRAINT categories_service_slug_key UNIQUE (slug);


--
-- Name: freelancers freelancers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.freelancers
    ADD CONSTRAINT freelancers_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: products products_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_slug_key UNIQUE (slug);


--
-- Name: quotation_proposals quotation_proposals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quotation_proposals
    ADD CONSTRAINT quotation_proposals_pkey PRIMARY KEY (id);


--
-- Name: quotations quotations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quotations
    ADD CONSTRAINT quotations_pkey PRIMARY KEY (id);


--
-- Name: ratings ratings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_pkey PRIMARY KEY (id);


--
-- Name: services services_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);


--
-- Name: services services_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_slug_key UNIQUE (slug);


--
-- Name: settings settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_pkey PRIMARY KEY (id);


--
-- Name: site site_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.site
    ADD CONSTRAINT site_pkey PRIMARY KEY (id);


--
-- Name: suppliers suppliers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: ix_blogs_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_blogs_id ON public.blogs USING btree (id);


--
-- Name: ix_cart_items_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_cart_items_id ON public.cart_items USING btree (id);


--
-- Name: ix_categories_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_categories_id ON public.categories USING btree (id);


--
-- Name: ix_categories_service_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_categories_service_id ON public.categories_service USING btree (id);


--
-- Name: ix_freelancers_city; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_freelancers_city ON public.freelancers USING btree (city);


--
-- Name: ix_freelancers_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_freelancers_email ON public.freelancers USING btree (email);


--
-- Name: ix_freelancers_first_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_freelancers_first_name ON public.freelancers USING btree (first_name);


--
-- Name: ix_freelancers_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_freelancers_id ON public.freelancers USING btree (id);


--
-- Name: ix_freelancers_last_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_freelancers_last_name ON public.freelancers USING btree (last_name);


--
-- Name: ix_freelancers_tel; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_freelancers_tel ON public.freelancers USING btree (tel);


--
-- Name: ix_freelancers_username; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_freelancers_username ON public.freelancers USING btree (username);


--
-- Name: ix_order_items_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_order_items_id ON public.order_items USING btree (id);


--
-- Name: ix_orders_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_orders_id ON public.orders USING btree (id);


--
-- Name: ix_products_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_products_id ON public.products USING btree (id);


--
-- Name: ix_quotation_proposals_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_quotation_proposals_id ON public.quotation_proposals USING btree (id);


--
-- Name: ix_quotations_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_quotations_id ON public.quotations USING btree (id);


--
-- Name: ix_ratings_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_ratings_id ON public.ratings USING btree (id);


--
-- Name: ix_services_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_services_id ON public.services USING btree (id);


--
-- Name: ix_settings_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_settings_id ON public.settings USING btree (id);


--
-- Name: ix_site_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_site_id ON public.site USING btree (id);


--
-- Name: ix_suppliers_city; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_suppliers_city ON public.suppliers USING btree (city);


--
-- Name: ix_suppliers_company_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_suppliers_company_name ON public.suppliers USING btree (company_name);


--
-- Name: ix_suppliers_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_suppliers_email ON public.suppliers USING btree (email);


--
-- Name: ix_suppliers_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_suppliers_id ON public.suppliers USING btree (id);


--
-- Name: ix_suppliers_main_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_suppliers_main_category ON public.suppliers USING btree (main_category);


--
-- Name: ix_suppliers_owner_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_suppliers_owner_name ON public.suppliers USING btree (owner_name);


--
-- Name: ix_suppliers_tel; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_suppliers_tel ON public.suppliers USING btree (tel);


--
-- Name: ix_users_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_users_id ON public.users USING btree (id);


--
-- Name: ix_users_username; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_users_username ON public.users USING btree (username);


--
-- Name: cart_items cart_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: cart_items cart_items_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: quotations fk_quotation_proposal; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quotations
    ADD CONSTRAINT fk_quotation_proposal FOREIGN KEY (selected_proposal_id) REFERENCES public.quotation_proposals(id);


--
-- Name: freelancers freelancers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.freelancers
    ADD CONSTRAINT freelancers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: order_items order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: products products_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id);


--
-- Name: quotation_proposals quotation_proposals_freelancer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quotation_proposals
    ADD CONSTRAINT quotation_proposals_freelancer_id_fkey FOREIGN KEY (freelancer_id) REFERENCES public.freelancers(id);


--
-- Name: quotation_proposals quotation_proposals_quotation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quotation_proposals
    ADD CONSTRAINT quotation_proposals_quotation_id_fkey FOREIGN KEY (quotation_id) REFERENCES public.quotations(id);


--
-- Name: quotations quotations_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quotations
    ADD CONSTRAINT quotations_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id);


--
-- Name: ratings ratings_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: ratings ratings_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id) ON DELETE CASCADE;


--
-- Name: ratings ratings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: services services_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories_service(id);


--
-- Name: subcategories subcategories_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subcategories
    ADD CONSTRAINT subcategories_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: products products_subcategory_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_subcategory_id_fkey FOREIGN KEY (subcategory_id) REFERENCES public.subcategories(id);


--
-- PostgreSQL database dump complete
--

\unrestrict pDXwZVcKbFAdc53mYHBpZusQjOlaP98fhdrLSNeJ0dbYR9aqrLp2WLEXX0DtT8f

