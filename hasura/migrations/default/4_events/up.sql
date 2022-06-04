CREATE TABLE public.event
(
    id                uuid        NOT NULL DEFAULT gen_random_uuid(),
    time              timestamptz NOT NULL DEFAULT now(),
    modification_type varchar(32) NOT NULL,
    event_type        text        NOT NULL,
    workspace_id      uuid,
    deck_id           uuid                 DEFAULT NULL,
    track_id          uuid                 DEFAULT NULL,
    file_id           uuid                 DEFAULT NULL,
    FOREIGN KEY (workspace_id) REFERENCES public.workspace (id) ON UPDATE restrict ON DELETE cascade,
    FOREIGN KEY (deck_id) REFERENCES public.deck (id) ON UPDATE restrict ON DELETE set null,
    FOREIGN KEY (track_id) REFERENCES public.track (id) ON UPDATE restrict ON DELETE set null,
    FOREIGN KEY (file_id) REFERENCES public.file (id) ON UPDATE restrict ON DELETE set null
);

CREATE OR REPLACE FUNCTION public.create_deck_update()
    RETURNS TRIGGER AS
$$
BEGIN
    IF tg_argv[0] = 'delete' THEN
        INSERT INTO event (modification_type, event_type, workspace_id, deck_id)
        VALUES (tg_argv[0], 'deck', OLD.workspace_id, NULL);
        RETURN NULL;
    ELSE
        INSERT INTO event (modification_type, event_type, workspace_id, deck_id)
        VALUES (tg_argv[0], 'deck', NEW.workspace_id, NEW.id);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.create_track_update()
    RETURNS TRIGGER AS
$$
DECLARE
    _workspace_id uuid;
BEGIN
    IF tg_argv[0] = 'delete' THEN
        SELECT workspace_id INTO _workspace_id FROM deck WHERE deck.id = OLD.deck_id LIMIT 1;
        INSERT INTO event (modification_type, event_type, workspace_id, track_id)
        VALUES (tg_argv[0], 'track', _workspace_id, NULL);
        RETURN NULL;
    ELSE
        SELECT workspace_id INTO _workspace_id FROM deck WHERE deck.id = NEW.deck_id LIMIT 1;
        INSERT INTO event (modification_type, event_type, workspace_id, track_id)
        VALUES (tg_argv[0], 'track', _workspace_id, NEW.id);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION public.create_file_update()
    RETURNS TRIGGER AS
$$
BEGIN
    IF tg_argv[0] = 'delete' THEN
        INSERT INTO event (modification_type, event_type, workspace_id, file_id)
        VALUES (tg_argv[0], 'file', OLD.workspace_id, NULL);
        RETURN NULL;
    ELSE
        INSERT INTO event (modification_type, event_type, workspace_id, file_id)
        VALUES (tg_argv[0], 'file', NEW.workspace_id, NEW.id);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- <-- Deck Updates -->
CREATE TRIGGER deck_update_trigger_insert
    AFTER INSERT
    ON public.deck
    FOR EACH ROW
EXECUTE FUNCTION public.create_deck_update('insert');

CREATE TRIGGER deck_update_trigger_update
    AFTER UPDATE
    ON public.deck
    FOR EACH ROW
EXECUTE FUNCTION public.create_deck_update('update');

CREATE TRIGGER deck_update_trigger_delete
    AFTER DELETE
    ON public.deck
    FOR EACH ROW
EXECUTE FUNCTION public.create_deck_update('delete');

-- <-- Track Updates -->
CREATE TRIGGER track_update_trigger_insert
    AFTER INSERT
    ON public.track
    FOR EACH ROW
EXECUTE FUNCTION public.create_track_update('insert');

CREATE TRIGGER track_update_trigger_update
    AFTER UPDATE
    ON public.track
    FOR EACH ROW
EXECUTE FUNCTION public.create_track_update('update');

CREATE TRIGGER track_update_trigger_delete
    AFTER DELETE
    ON public.track
    FOR EACH ROW
EXECUTE FUNCTION public.create_track_update('delete');

-- <-- File Updates -->
CREATE TRIGGER file_update_trigger_insert
    AFTER INSERT
    ON public.file
    FOR EACH ROW
EXECUTE FUNCTION public.create_file_update('insert');

CREATE TRIGGER file_update_trigger_update
    AFTER UPDATE
    ON public.file
    FOR EACH ROW
EXECUTE FUNCTION public.create_file_update('update');

CREATE TRIGGER file_update_trigger_delete
    AFTER DELETE
    ON public.file
    FOR EACH ROW
EXECUTE FUNCTION public.create_file_update('delete');