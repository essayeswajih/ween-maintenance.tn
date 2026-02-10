--
-- PostgreSQL database dump
--

\restrict vJ1aiSExLzyEAIlrgSXAU8Vc2DLfAcgWRXqsdL144bbtLo17unrRcmc5sy4OaWN

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2026-01-29 13:20:06

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
-- TOC entry 881 (class 1247 OID 16391)
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
-- TOC entry 240 (class 1259 OID 16593)
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
-- TOC entry 239 (class 1259 OID 16592)
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
-- TOC entry 5218 (class 0 OID 0)
-- Dependencies: 239
-- Name: cart_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cart_items_id_seq OWNED BY public.cart_items.id;


--
-- TOC entry 222 (class 1259 OID 16414)
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
-- TOC entry 221 (class 1259 OID 16413)
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
-- TOC entry 5219 (class 0 OID 0)
-- Dependencies: 221
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- TOC entry 226 (class 1259 OID 16446)
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
-- TOC entry 225 (class 1259 OID 16445)
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
-- TOC entry 5220 (class 0 OID 0)
-- Dependencies: 225
-- Name: categories_service_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_service_id_seq OWNED BY public.categories_service.id;


--
-- TOC entry 232 (class 1259 OID 16499)
-- Name: freelancers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.freelancers (
    id integer NOT NULL,
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
-- TOC entry 231 (class 1259 OID 16498)
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
-- TOC entry 5221 (class 0 OID 0)
-- Dependencies: 231
-- Name: freelancers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.freelancers_id_seq OWNED BY public.freelancers.id;


--
-- TOC entry 238 (class 1259 OID 16570)
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
-- TOC entry 237 (class 1259 OID 16569)
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
-- TOC entry 5222 (class 0 OID 0)
-- Dependencies: 237
-- Name: order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;


--
-- TOC entry 224 (class 1259 OID 16428)
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
-- TOC entry 223 (class 1259 OID 16427)
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
-- TOC entry 5223 (class 0 OID 0)
-- Dependencies: 223
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- TOC entry 234 (class 1259 OID 16521)
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
    supplier_id integer
);


ALTER TABLE public.products OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16520)
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
-- TOC entry 5224 (class 0 OID 0)
-- Dependencies: 233
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- TOC entry 246 (class 1259 OID 16669)
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
-- TOC entry 245 (class 1259 OID 16668)
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
-- TOC entry 5225 (class 0 OID 0)
-- Dependencies: 245
-- Name: quotation_proposals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.quotation_proposals_id_seq OWNED BY public.quotation_proposals.id;


--
-- TOC entry 242 (class 1259 OID 16613)
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
    updated_at timestamp with time zone,
    user_id integer
);


ALTER TABLE public.quotations OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 16612)
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
-- TOC entry 5226 (class 0 OID 0)
-- Dependencies: 241
-- Name: quotations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.quotations_id_seq OWNED BY public.quotations.id;


--
-- TOC entry 244 (class 1259 OID 16638)
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
-- TOC entry 243 (class 1259 OID 16637)
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
-- TOC entry 5227 (class 0 OID 0)
-- Dependencies: 243
-- Name: ratings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ratings_id_seq OWNED BY public.ratings.id;


--
-- TOC entry 236 (class 1259 OID 16548)
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
    rating double precision DEFAULT 0.0,
    num_ratings integer DEFAULT 0,
    price_unit character varying DEFAULT 'intervention'::character varying,
    features json,
    process json
);


ALTER TABLE public.services OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 16547)
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
-- TOC entry 5228 (class 0 OID 0)
-- Dependencies: 235
-- Name: services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.services_id_seq OWNED BY public.services.id;


--
-- TOC entry 248 (class 1259 OID 16697)
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
-- TOC entry 247 (class 1259 OID 16696)
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
-- TOC entry 5229 (class 0 OID 0)
-- Dependencies: 247
-- Name: settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.settings_id_seq OWNED BY public.settings.id;


--
-- TOC entry 230 (class 1259 OID 16482)
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
-- TOC entry 229 (class 1259 OID 16481)
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
-- TOC entry 5230 (class 0 OID 0)
-- Dependencies: 229
-- Name: site_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.site_id_seq OWNED BY public.site.id;


--
-- TOC entry 228 (class 1259 OID 16463)
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
-- TOC entry 227 (class 1259 OID 16462)
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
-- TOC entry 5231 (class 0 OID 0)
-- Dependencies: 227
-- Name: suppliers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.suppliers_id_seq OWNED BY public.suppliers.id;


--
-- TOC entry 220 (class 1259 OID 16400)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying,
    email character varying NOT NULL,
    hashed_password character varying NOT NULL,
    full_name character varying,
    phone character varying,
    role character varying DEFAULT 'client'::character varying,
    two_factor_enabled integer DEFAULT 0
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16399)
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
-- TOC entry 5232 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4946 (class 2604 OID 16596)
-- Name: cart_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items ALTER COLUMN id SET DEFAULT nextval('public.cart_items_id_seq'::regclass);


--
-- TOC entry 4932 (class 2604 OID 16417)
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- TOC entry 4934 (class 2604 OID 16449)
-- Name: categories_service id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories_service ALTER COLUMN id SET DEFAULT nextval('public.categories_service_id_seq'::regclass);


--
-- TOC entry 4938 (class 2604 OID 16502)
-- Name: freelancers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.freelancers ALTER COLUMN id SET DEFAULT nextval('public.freelancers_id_seq'::regclass);


--
-- TOC entry 4945 (class 2604 OID 16573)
-- Name: order_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);


--
-- TOC entry 4933 (class 2604 OID 16431)
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- TOC entry 4940 (class 2604 OID 16524)
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- TOC entry 4951 (class 2604 OID 16672)
-- Name: quotation_proposals id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quotation_proposals ALTER COLUMN id SET DEFAULT nextval('public.quotation_proposals_id_seq'::regclass);


--
-- TOC entry 4947 (class 2604 OID 16616)
-- Name: quotations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quotations ALTER COLUMN id SET DEFAULT nextval('public.quotations_id_seq'::regclass);


--
-- TOC entry 4949 (class 2604 OID 16641)
-- Name: ratings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ratings ALTER COLUMN id SET DEFAULT nextval('public.ratings_id_seq'::regclass);


--
-- TOC entry 4941 (class 2604 OID 16551)
-- Name: services id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services ALTER COLUMN id SET DEFAULT nextval('public.services_id_seq'::regclass);


--
-- TOC entry 4953 (class 2604 OID 16700)
-- Name: settings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.settings ALTER COLUMN id SET DEFAULT nextval('public.settings_id_seq'::regclass);


--
-- TOC entry 4937 (class 2604 OID 16485)
-- Name: site id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.site ALTER COLUMN id SET DEFAULT nextval('public.site_id_seq'::regclass);


--
-- TOC entry 4935 (class 2604 OID 16466)
-- Name: suppliers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suppliers ALTER COLUMN id SET DEFAULT nextval('public.suppliers_id_seq'::regclass);


--
-- TOC entry 4929 (class 2604 OID 16403)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 5204 (class 0 OID 16593)
-- Dependencies: 240
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_items (id, user_id, product_id, quantity) FROM stdin;
\.


--
-- TOC entry 5186 (class 0 OID 16414)
-- Dependencies: 222
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, name, description, image_url) FROM stdin;
1	Chauffage	Équipements de chauffage	heating.jpg
2	Plomberie	Matériel de plomberie	plumbing.jpg
3	Électricité	Matériel électrique	electric.jpg
\.


--
-- TOC entry 5190 (class 0 OID 16446)
-- Dependencies: 226
-- Data for Name: categories_service; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories_service (id, name, description, image_url, slug) FROM stdin;
1	Réparation	Services de réparation	\N	reparation
2	Installation	Services d'installation	\N	installation
\.


--
-- TOC entry 5196 (class 0 OID 16499)
-- Dependencies: 232
-- Data for Name: freelancers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.freelancers (id, first_name, last_name, username, email, tel, website, title, bio, skills, services, experience_years, hourly_rate, address, city, country, matricule_fiscale, cin, verified, is_active, rating, reviews_count, avatar, cover_image, notes, blocked_reason, created_at, updated_at) FROM stdin;
1	Mario	Rossi	mario_plumber	mario@example.com	20123456	\N	Plombier Expert	10 ans d'expérience en plomberie résidentielle.	["Plomberie", "Chauffage"]	["D\\u00e9pannage", "Installation sanitaire"]	0	\N	\N	Tunis	Tunisia	\N	\N	t	t	4.9	15	\N	\N	\N	\N	2026-01-27 20:26:22.571347+01	\N
\.


--
-- TOC entry 5202 (class 0 OID 16570)
-- Dependencies: 238
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_items (id, order_id, product_id, quantity, price, name, color, size) FROM stdin;
\.


--
-- TOC entry 5188 (class 0 OID 16428)
-- Dependencies: 224
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, total_amount, status, created_at, username, email, telephone, location, payment_method, payed, code) FROM stdin;
\.


--
-- TOC entry 5198 (class 0 OID 16521)
-- Dependencies: 234
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, name, description, price, discounted_price, stock_quantity, category_id, image_url, image2_url, image3_url, image4_url, sizes, colors, materials, care, features, sku, promo, buzzent, rating, num_ratings, in_stock, slug, supplier_id) FROM stdin;
2	Tuyauterie Cuivre 22mm	Tuyau en cuivre haute qualité pour plomberie.	89.5	\N	100	2	tuyau_cuivre.jpg	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	4.9	95	t	tuyauterie-cuivre-22mm	\N
3	Câble Électrique 2.5mm²	Rouleau de 100m de câble électrique standard.	59.99	\N	200	3	cable_elec.jpg	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	4.7	156	t	cable-electrique-2-5mm	\N
4	Thermostat Intelligent WiFi	Contrôlez votre chauffage depuis votre smartphone.	199.99	\N	30	1	thermostat_wifi.jpg	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	4.9	203	t	thermostat-intelligent-wifi	\N
\.


--
-- TOC entry 5210 (class 0 OID 16669)
-- Dependencies: 246
-- Data for Name: quotation_proposals; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.quotation_proposals (id, quotation_id, freelancer_id, price, message, status, created_at) FROM stdin;
\.


--
-- TOC entry 5206 (class 0 OID 16613)
-- Dependencies: 242
-- Data for Name: quotations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.quotations (id, service_id, first_name, last_name, email, phone, address, city, postal_code, description, preferred_timeline, created_at) FROM stdin;
\.


--
-- TOC entry 5208 (class 0 OID 16638)
-- Dependencies: 244
-- Data for Name: ratings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ratings (id, user_id, rating, comment, service_id, product_id, created_at) FROM stdin;
5	1	5	Excellent service, très professionnel.	2	\N	2026-01-28 21:58:37.480902+01
6	1	5	Ponctuel et très compétent.	2	\N	2026-01-28 21:58:37.480902+01
7	1	4	Travail bien fait, propre et soigné.	2	\N	2026-01-28 21:58:37.480902+01
8	1	5	Ponctuel et très compétent.	2	\N	2026-01-28 21:58:37.480902+01
9	1	4	Satisfait du résultat, prix correct.	2	\N	2026-01-28 21:58:37.480902+01
10	1	5	Intervention rapide et efficace. Je recommande !	1	\N	2026-01-28 21:58:37.480902+01
11	1	5	Intervention rapide et efficace. Je recommande !	1	\N	2026-01-28 21:58:37.480902+01
12	1	5	Excellent service, très professionnel.	1	\N	2026-01-28 21:58:37.480902+01
13	1	5	Intervention rapide et efficace. Je recommande !	1	\N	2026-01-28 21:58:37.480902+01
14	1	4	Satisfait du résultat, prix correct.	1	\N	2026-01-28 21:58:37.480902+01
15	1	5	Intervention rapide et efficace. Je recommande !	3	\N	2026-01-28 21:58:37.480902+01
16	1	5	Intervention rapide et efficace. Je recommande !	3	\N	2026-01-28 21:58:37.480902+01
17	1	5	Excellent service, très professionnel.	3	\N	2026-01-28 21:58:37.480902+01
18	1	5	a7sen service	3	\N	2026-01-28 22:09:33.478735+01
19	2	5	tayara	1	\N	2026-01-28 22:47:04.90018+01
\.


--
-- TOC entry 5200 (class 0 OID 16548)
-- Dependencies: 236
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.services (id, name, description, price, specialties, disponiblity, "moyDuration", category_id, image_url, slug, rating, num_ratings, price_unit, features, process) FROM stdin;
1	Plomberie d'Urgence	Intervention rapide pour fuites et débouchage.	50	Fuites, Débouchage	Lun-Dim 7h-20h	1	1	💧	plomberie-urgence	4.8	5	intervention	\N	\N
2	Installation Électrique	Installation complète ou rénovation électrique.	100	Rénovation, Neuf	Lun-Dim 7h-20h	5	2	⚡	installation-electrique	4.6	5	intervention	\N	\N
3	Maintenance Chaudière	Entretien annuel et dépannage chaudière.	80	Gaz, Fioul	Lun-Dim 7h-20h	2	1	🔧	maintenance-chaudiere	5	3	intervention	\N	\N
\.


--
-- TOC entry 5212 (class 0 OID 16697)
-- Dependencies: 248
-- Data for Name: settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.settings (id, store_name, email, phone, address, shipping_cost, free_shipping_threshold, tax_rate, currency) FROM stdin;
1	Ween-Maintenance.tn	info@maintenance.tn	+216 27 553 981	Tunis, Tunisie	10	100	19	DT
\.


--
-- TOC entry 5194 (class 0 OID 16482)
-- Dependencies: 230
-- Data for Name: site; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.site (id, name, email, phone, address, city, country, shipping_cost, free_shipping_threshold, tax_rate, currency) FROM stdin;
\.


--
-- TOC entry 5192 (class 0 OID 16463)
-- Dependencies: 228
-- Data for Name: suppliers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.suppliers (id, owner_name, company_name, matricule_fiscale, forme_juridique, site, email, tel, main_category, services, address, city, country, verified, is_active, notes, blocked_reason, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5184 (class 0 OID 16400)
-- Dependencies: 220
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, email, hashed_password, full_name, phone, role, two_factor_enabled) FROM stdin;
1	wajihsayes@gmail.com	wajihsayes@gmail.com	$2b$12$XHUBJgUUjDqm7oCcM5vxLOJu2DvoIyyAFFQdF8K8BA27SCLEk73Mm	Admin Wajih	27553981	admin	0
2	wajihsayes1@gmail.com	wajihsayes1@gmail.com	$2b$12$GNApVHPEOKxfndPujXQBw.Y5oxyNaZUxbi/crFHajuZB.IXbETkpO	Mohamed Essayes	27553981	client	0
\.


--
-- TOC entry 5233 (class 0 OID 0)
-- Dependencies: 239
-- Name: cart_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cart_items_id_seq', 1, false);


--
-- TOC entry 5234 (class 0 OID 0)
-- Dependencies: 221
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 3, true);


--
-- TOC entry 5235 (class 0 OID 0)
-- Dependencies: 225
-- Name: categories_service_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_service_id_seq', 2, true);


--
-- TOC entry 5236 (class 0 OID 0)
-- Dependencies: 231
-- Name: freelancers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.freelancers_id_seq', 1, true);


--
-- TOC entry 5237 (class 0 OID 0)
-- Dependencies: 237
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_items_id_seq', 1, false);


--
-- TOC entry 5238 (class 0 OID 0)
-- Dependencies: 223
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_id_seq', 1, false);


--
-- TOC entry 5239 (class 0 OID 0)
-- Dependencies: 233
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 4, true);


--
-- TOC entry 5240 (class 0 OID 0)
-- Dependencies: 245
-- Name: quotation_proposals_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.quotation_proposals_id_seq', 1, false);


--
-- TOC entry 5241 (class 0 OID 0)
-- Dependencies: 241
-- Name: quotations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.quotations_id_seq', 1, false);


--
-- TOC entry 5242 (class 0 OID 0)
-- Dependencies: 243
-- Name: ratings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ratings_id_seq', 19, true);


--
-- TOC entry 5243 (class 0 OID 0)
-- Dependencies: 235
-- Name: services_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.services_id_seq', 3, true);


--
-- TOC entry 5244 (class 0 OID 0)
-- Dependencies: 247
-- Name: settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.settings_id_seq', 1, true);


--
-- TOC entry 5245 (class 0 OID 0)
-- Dependencies: 229
-- Name: site_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.site_id_seq', 1, false);


--
-- TOC entry 5246 (class 0 OID 0)
-- Dependencies: 227
-- Name: suppliers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.suppliers_id_seq', 1, false);


--
-- TOC entry 5247 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 2, true);


--
-- TOC entry 5009 (class 2606 OID 16600)
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);


--
-- TOC entry 4960 (class 2606 OID 16425)
-- Name: categories categories_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key UNIQUE (name);


--
-- TOC entry 4962 (class 2606 OID 16423)
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- TOC entry 4968 (class 2606 OID 16458)
-- Name: categories_service categories_service_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories_service
    ADD CONSTRAINT categories_service_name_key UNIQUE (name);


--
-- TOC entry 4970 (class 2606 OID 16456)
-- Name: categories_service categories_service_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories_service
    ADD CONSTRAINT categories_service_pkey PRIMARY KEY (id);


--
-- TOC entry 4972 (class 2606 OID 16460)
-- Name: categories_service categories_service_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories_service
    ADD CONSTRAINT categories_service_slug_key UNIQUE (slug);


--
-- TOC entry 4987 (class 2606 OID 16512)
-- Name: freelancers freelancers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.freelancers
    ADD CONSTRAINT freelancers_pkey PRIMARY KEY (id);


--
-- TOC entry 5007 (class 2606 OID 16580)
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- TOC entry 4966 (class 2606 OID 16443)
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- TOC entry 4997 (class 2606 OID 16533)
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- TOC entry 4999 (class 2606 OID 16535)
-- Name: products products_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_slug_key UNIQUE (slug);


--
-- TOC entry 5019 (class 2606 OID 16681)
-- Name: quotation_proposals quotation_proposals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quotation_proposals
    ADD CONSTRAINT quotation_proposals_pkey PRIMARY KEY (id);


--
-- TOC entry 5013 (class 2606 OID 16630)
-- Name: quotations quotations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quotations
    ADD CONSTRAINT quotations_pkey PRIMARY KEY (id);


--
-- TOC entry 5016 (class 2606 OID 16650)
-- Name: ratings ratings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_pkey PRIMARY KEY (id);


--
-- TOC entry 5002 (class 2606 OID 16560)
-- Name: services services_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);


--
-- TOC entry 5004 (class 2606 OID 16562)
-- Name: services services_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_slug_key UNIQUE (slug);


--
-- TOC entry 5022 (class 2606 OID 16705)
-- Name: settings settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_pkey PRIMARY KEY (id);


--
-- TOC entry 4985 (class 2606 OID 16496)
-- Name: site site_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.site
    ADD CONSTRAINT site_pkey PRIMARY KEY (id);


--
-- TOC entry 4982 (class 2606 OID 16473)
-- Name: suppliers suppliers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_pkey PRIMARY KEY (id);


--
-- TOC entry 4958 (class 2606 OID 16410)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 5010 (class 1259 OID 16611)
-- Name: ix_cart_items_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_cart_items_id ON public.cart_items USING btree (id);


--
-- TOC entry 4963 (class 1259 OID 16426)
-- Name: ix_categories_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_categories_id ON public.categories USING btree (id);


--
-- TOC entry 4973 (class 1259 OID 16461)
-- Name: ix_categories_service_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_categories_service_id ON public.categories_service USING btree (id);


--
-- TOC entry 4988 (class 1259 OID 16514)
-- Name: ix_freelancers_city; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_freelancers_city ON public.freelancers USING btree (city);


--
-- TOC entry 4989 (class 1259 OID 16518)
-- Name: ix_freelancers_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_freelancers_email ON public.freelancers USING btree (email);


--
-- TOC entry 4990 (class 1259 OID 16519)
-- Name: ix_freelancers_first_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_freelancers_first_name ON public.freelancers USING btree (first_name);


--
-- TOC entry 4991 (class 1259 OID 16515)
-- Name: ix_freelancers_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_freelancers_id ON public.freelancers USING btree (id);


--
-- TOC entry 4992 (class 1259 OID 16513)
-- Name: ix_freelancers_last_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_freelancers_last_name ON public.freelancers USING btree (last_name);


--
-- TOC entry 4993 (class 1259 OID 16516)
-- Name: ix_freelancers_tel; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_freelancers_tel ON public.freelancers USING btree (tel);


--
-- TOC entry 4994 (class 1259 OID 16517)
-- Name: ix_freelancers_username; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_freelancers_username ON public.freelancers USING btree (username);


--
-- TOC entry 5005 (class 1259 OID 16591)
-- Name: ix_order_items_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_order_items_id ON public.order_items USING btree (id);


--
-- TOC entry 4964 (class 1259 OID 16444)
-- Name: ix_orders_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_orders_id ON public.orders USING btree (id);


--
-- TOC entry 4995 (class 1259 OID 16546)
-- Name: ix_products_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_products_id ON public.products USING btree (id);


--
-- TOC entry 5017 (class 1259 OID 16692)
-- Name: ix_quotation_proposals_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_quotation_proposals_id ON public.quotation_proposals USING btree (id);


--
-- TOC entry 5011 (class 1259 OID 16636)
-- Name: ix_quotations_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_quotations_id ON public.quotations USING btree (id);


--
-- TOC entry 5014 (class 1259 OID 16666)
-- Name: ix_ratings_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_ratings_id ON public.ratings USING btree (id);


--
-- TOC entry 5000 (class 1259 OID 16568)
-- Name: ix_services_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_services_id ON public.services USING btree (id);


--
-- TOC entry 5020 (class 1259 OID 16706)
-- Name: ix_settings_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_settings_id ON public.settings USING btree (id);


--
-- TOC entry 4983 (class 1259 OID 16497)
-- Name: ix_site_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_site_id ON public.site USING btree (id);


--
-- TOC entry 4974 (class 1259 OID 16477)
-- Name: ix_suppliers_city; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_suppliers_city ON public.suppliers USING btree (city);


--
-- TOC entry 4975 (class 1259 OID 16475)
-- Name: ix_suppliers_company_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_suppliers_company_name ON public.suppliers USING btree (company_name);


--
-- TOC entry 4976 (class 1259 OID 16479)
-- Name: ix_suppliers_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_suppliers_email ON public.suppliers USING btree (email);


--
-- TOC entry 4977 (class 1259 OID 16478)
-- Name: ix_suppliers_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_suppliers_id ON public.suppliers USING btree (id);


--
-- TOC entry 4978 (class 1259 OID 16476)
-- Name: ix_suppliers_main_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_suppliers_main_category ON public.suppliers USING btree (main_category);


--
-- TOC entry 4979 (class 1259 OID 16474)
-- Name: ix_suppliers_owner_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_suppliers_owner_name ON public.suppliers USING btree (owner_name);


--
-- TOC entry 4980 (class 1259 OID 16480)
-- Name: ix_suppliers_tel; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_suppliers_tel ON public.suppliers USING btree (tel);


--
-- TOC entry 4955 (class 1259 OID 16412)
-- Name: ix_users_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_users_id ON public.users USING btree (id);


--
-- TOC entry 4956 (class 1259 OID 16411)
-- Name: ix_users_username; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_users_username ON public.users USING btree (username);


--
-- TOC entry 5028 (class 2606 OID 16606)
-- Name: cart_items cart_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- TOC entry 5029 (class 2606 OID 16601)
-- Name: cart_items cart_items_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 5026 (class 2606 OID 16581)
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- TOC entry 5027 (class 2606 OID 16586)
-- Name: order_items order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- TOC entry 5023 (class 2606 OID 16536)
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- TOC entry 5024 (class 2606 OID 16541)
-- Name: products products_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id);


--
-- TOC entry 5034 (class 2606 OID 16687)
-- Name: quotation_proposals quotation_proposals_freelancer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quotation_proposals
    ADD CONSTRAINT quotation_proposals_freelancer_id_fkey FOREIGN KEY (freelancer_id) REFERENCES public.freelancers(id);


--
-- TOC entry 5035 (class 2606 OID 16682)
-- Name: quotation_proposals quotation_proposals_quotation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quotation_proposals
    ADD CONSTRAINT quotation_proposals_quotation_id_fkey FOREIGN KEY (quotation_id) REFERENCES public.quotations(id);


--
-- TOC entry 5030 (class 2606 OID 16631)
-- Name: quotations quotations_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quotations
    ADD CONSTRAINT quotations_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id);


ALTER TABLE ONLY public.quotations
    ADD CONSTRAINT fk_quotation_proposal FOREIGN KEY (selected_proposal_id) REFERENCES public.quotation_proposals(id);


ALTER TABLE ONLY public.quotations
    ADD CONSTRAINT quotations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 5031 (class 2606 OID 16661)
-- Name: ratings ratings_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- TOC entry 5032 (class 2606 OID 16656)
-- Name: ratings ratings_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id) ON DELETE CASCADE;


--
-- TOC entry 5033 (class 2606 OID 16651)
-- Name: ratings ratings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5025 (class 2606 OID 16563)
-- Name: services services_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories_service(id);


-- Completed on 2026-01-29 13:20:06

--
-- PostgreSQL database dump complete
--

\unrestrict vJ1aiSExLzyEAIlrgSXAU8Vc2DLfAcgWRXqsdL144bbtLo17unrRcmc5sy4OaWN

