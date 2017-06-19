--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.6
-- Dumped by pg_dump version 9.5.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

--
-- Name: form_group_id_seq; Type: SEQUENCE; Schema: public; Owner: fillitup
--

CREATE SEQUENCE form_group_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE form_group_id_seq OWNER TO fillitup;

--
-- Name: form_id_seq; Type: SEQUENCE; Schema: public; Owner: fillitup
--

CREATE SEQUENCE form_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE form_id_seq OWNER TO fillitup;

--
-- Name: form_instance_id_seq; Type: SEQUENCE; Schema: public; Owner: fillitup
--

CREATE SEQUENCE form_instance_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE form_instance_id_seq OWNER TO fillitup;

--
-- Name: group_id_seq; Type: SEQUENCE; Schema: public; Owner: fillitup
--

CREATE SEQUENCE group_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE group_id_seq OWNER TO fillitup;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: t_form; Type: TABLE; Schema: public; Owner: fillitup
--

CREATE TABLE t_form (
    name text,
    description text,
    owner integer,
    created timestamp with time zone DEFAULT now(),
    status text,
    json_object json,
    id integer DEFAULT nextval('form_id_seq'::regclass) NOT NULL
);


ALTER TABLE t_form OWNER TO fillitup;

--
-- Name: t_form_group; Type: TABLE; Schema: public; Owner: fillitup
--

CREATE TABLE t_form_group (
    id integer DEFAULT nextval('form_group_id_seq'::regclass) NOT NULL,
    name text,
    description text,
    owner integer,
    created timestamp with time zone DEFAULT now(),
    status text,
    groupid integer NOT NULL
);


ALTER TABLE t_form_group OWNER TO fillitup;

--
-- Name: t_form_instance; Type: TABLE; Schema: public; Owner: fillitup
--

CREATE TABLE t_form_instance (
    id integer DEFAULT nextval('form_instance_id_seq'::regclass) NOT NULL,
    owner integer,
    created timestamp with time zone DEFAULT now(),
    submitted date,
    json_object json,
    formid integer
);


ALTER TABLE t_form_instance OWNER TO fillitup;

--
-- Name: t_group; Type: TABLE; Schema: public; Owner: fillitup
--

CREATE TABLE t_group (
    id integer DEFAULT nextval('group_id_seq'::regclass) NOT NULL,
    name text,
    description text,
    created timestamp with time zone DEFAULT now(),
    status text
);


ALTER TABLE t_group OWNER TO fillitup;

--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: fillitup
--

CREATE SEQUENCE user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE user_id_seq OWNER TO fillitup;

--
-- Name: t_user; Type: TABLE; Schema: public; Owner: fillitup
--

CREATE TABLE t_user (
    id integer DEFAULT nextval('user_id_seq'::regclass) NOT NULL,
    name text,
    created timestamp with time zone DEFAULT now(),
    status text,
    password text,
    email text,
    username text
);


ALTER TABLE t_user OWNER TO fillitup;

--
-- Name: user_membership_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE user_membership_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE user_membership_id_seq OWNER TO postgres;

--
-- Name: t_user_group; Type: TABLE; Schema: public; Owner: fillitup
--

CREATE TABLE t_user_group (
    id integer DEFAULT nextval('user_membership_id_seq'::regclass) NOT NULL,
    userid integer,
    groupid integer,
    created timestamp with time zone DEFAULT now(),
    status text
);


ALTER TABLE t_user_group OWNER TO fillitup;

--
-- Name: u_form_type_id_seq; Type: SEQUENCE; Schema: public; Owner: fillitup
--

CREATE SEQUENCE u_form_type_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE u_form_type_id_seq OWNER TO fillitup;

--
-- Name: u_form_type; Type: TABLE; Schema: public; Owner: fillitup
--

CREATE TABLE u_form_type (
    id integer DEFAULT 'u_form_type_id_seq'::regclass NOT NULL,
    name text,
    description text,
    json_object json
);


ALTER TABLE u_form_type OWNER TO fillitup;

--
-- Name: user_group_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE user_group_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE user_group_id_seq OWNER TO postgres;

--
-- Name: t_form_group_pkey; Type: CONSTRAINT; Schema: public; Owner: fillitup
--

ALTER TABLE ONLY t_form_group
    ADD CONSTRAINT t_form_group_pkey PRIMARY KEY (id);


--
-- Name: t_form_instance_pkey; Type: CONSTRAINT; Schema: public; Owner: fillitup
--

ALTER TABLE ONLY t_form_instance
    ADD CONSTRAINT t_form_instance_pkey PRIMARY KEY (id);


--
-- Name: t_form_pkey; Type: CONSTRAINT; Schema: public; Owner: fillitup
--

ALTER TABLE ONLY t_form
    ADD CONSTRAINT t_form_pkey PRIMARY KEY (id);


--
-- Name: t_group_pkey; Type: CONSTRAINT; Schema: public; Owner: fillitup
--

ALTER TABLE ONLY t_group
    ADD CONSTRAINT t_group_pkey PRIMARY KEY (id);


--
-- Name: t_user_pkey; Type: CONSTRAINT; Schema: public; Owner: fillitup
--

ALTER TABLE ONLY t_user
    ADD CONSTRAINT t_user_pkey PRIMARY KEY (id);


--
-- Name: u_form_type_pkey; Type: CONSTRAINT; Schema: public; Owner: fillitup
--

ALTER TABLE ONLY u_form_type
    ADD CONSTRAINT u_form_type_pkey PRIMARY KEY (id);


--
-- Name: t_form_group_groupid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: fillitup
--

ALTER TABLE ONLY t_form_group
    ADD CONSTRAINT t_form_group_groupid_fkey FOREIGN KEY (groupid) REFERENCES t_group(id);


--
-- Name: t_form_group_owner_fkey; Type: FK CONSTRAINT; Schema: public; Owner: fillitup
--

ALTER TABLE ONLY t_form_group
    ADD CONSTRAINT t_form_group_owner_fkey FOREIGN KEY (owner) REFERENCES t_user(id);


--
-- Name: t_form_instance_formid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: fillitup
--

ALTER TABLE ONLY t_form_instance
    ADD CONSTRAINT t_form_instance_formid_fkey FOREIGN KEY (formid) REFERENCES t_form(id);


--
-- Name: t_form_instance_owner_fkey; Type: FK CONSTRAINT; Schema: public; Owner: fillitup
--

ALTER TABLE ONLY t_form_instance
    ADD CONSTRAINT t_form_instance_owner_fkey FOREIGN KEY (owner) REFERENCES t_user(id);


--
-- Name: t_form_owner_fkey; Type: FK CONSTRAINT; Schema: public; Owner: fillitup
--

ALTER TABLE ONLY t_form
    ADD CONSTRAINT t_form_owner_fkey FOREIGN KEY (owner) REFERENCES t_user(id);


--
-- Name: t_user_group_groupid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: fillitup
--

ALTER TABLE ONLY t_user_group
    ADD CONSTRAINT t_user_group_groupid_fkey FOREIGN KEY (groupid) REFERENCES t_group(id);


--
-- Name: t_user_group_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: fillitup
--

ALTER TABLE ONLY t_user_group
    ADD CONSTRAINT t_user_group_userid_fkey FOREIGN KEY (userid) REFERENCES t_user(id);


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

