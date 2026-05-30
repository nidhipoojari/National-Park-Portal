DROP SEQUENCE visitor_seq;
DROP SEQUENCE transaction_seq;
DROP SEQUENCE message_seq;
DROP TABLE message CASCADE CONSTRAINTS;

DROP TABLE transaction CASCADE CONSTRAINTS;

DROP TABLE tour_detail CASCADE CONSTRAINTS;

DROP TABLE tour CASCADE CONSTRAINTS;

DROP TABLE parking_lot CASCADE CONSTRAINTS;

DROP TABLE campsite CASCADE CONSTRAINTS;

DROP TABLE facility CASCADE CONSTRAINTS;

DROP TABLE visitor CASCADE CONSTRAINTS;

DROP TABLE park CASCADE CONSTRAINTS;

CREATE TABLE park (
    park_id NUMBER PRIMARY KEY,
    park_name VARCHAR2(100) NOT NULL,
    address VARCHAR2(300),
    state VARCHAR2(2),
    zipcode VARCHAR2(10) --storing information associated with the park
);
CREATE TABLE visitor (
    visitor_id NUMBER PRIMARY KEY,
    visitor_name VARCHAR2(100) NOT NULL,
    visitor_email VARCHAR2(100) UNIQUE NOT NULL, 
    address VARCHAR2(300),
    state VARCHAR2(2),
    zipcode VARCHAR2(10) 
);
INSERT INTO park (park_id, park_name, address, state, zipcode) 
VALUES (100, 'Patapsco Valley State Park', '8020 Baltimore National Pike', 'MD', '21043');
INSERT INTO park (park_id, park_name, address, state, zipcode) 
VALUES (101, 'Shenandoah National Park', '3655 US Highway 211 East', 'VA', '22835');
INSERT INTO park (park_id, park_name, address, state, zipcode) 
VALUES (102, 'Great Falls Park', '9200 Old Dominion Dr', 'VA', '22102');
INSERT INTO park (park_id, park_name, address, state, zipcode) 
VALUES (103, 'Centennial Park', '10000 Clarksville Pike', 'MD', '21042');
INSERT INTO park (park_id, park_name, address, state, zipcode) 
VALUES (104, 'Patterson Park', '2601 E Baltimore St', 'MD', '21224');
--total 5 parks are inserted into the database
INSERT INTO visitor (visitor_id, visitor_name, visitor_email, address, state, zipcode) 
VALUES (100, 'Alice Smith', 'alicesm@opera.com', '1000 Hilltop Circle', 'MD', '21250');
INSERT INTO visitor (visitor_id, visitor_name, visitor_email, address, state, zipcode) 
VALUES (101, 'Jeff Benson', 'jbenson88@gmail.com', '456 Lennar Drive', 'MD', '21244');
INSERT INTO visitor (visitor_id, visitor_name, visitor_email, address, state, zipcode) 
VALUES (102, 'Steve Seylin', 'sseylin@yahoo.com', '789 Security Blvd', 'MD', '21207');
INSERT INTO visitor (visitor_id, visitor_name, visitor_email, address, state, zipcode) 
VALUES (103, 'Bob Sorack', 'bsorack@hotmail.com', '321 Inner Harbor Way', 'MD', '21202');
INSERT INTO visitor (visitor_id, visitor_name, visitor_email, address, state, zipcode) 
VALUES (104, 'Lucas Grenst', 'lgrenst@umbc.edu', '555 College Ave', 'MD', '20740');

CREATE TABLE facility (
    facility_id NUMBER PRIMARY KEY,
    facility_name VARCHAR2(100) NOT NULL,
    park_id NUMBER NOT NULL,
    facility_type NUMBER NOT NULL CHECK (facility_type IN (1,2,3,4)),
    daily_price NUMBER(10,2) NOT NULL,
    child_price NUMBER(10,2),
    cancellation_fee NUMBER(10,2),
    CONSTRAINT fk_facility_park FOREIGN KEY (park_id) REFERENCES park(park_id)
);

CREATE TABLE campsite (
    facility_id NUMBER PRIMARY KEY,
    max_people NUMBER NOT NULL,
    CONSTRAINT fk_campsite_facility FOREIGN KEY (facility_id)
        REFERENCES facility(facility_id)
);

-- Type 1: Park Entrances (5)
INSERT INTO facility VALUES (1, 'Patapsco Valley State Park Main Entrance', 100, 1, 35.00, 20.00, 10.00);
INSERT INTO facility VALUES (2, 'Shenandoah National Park Main Entrance', 101, 1, 30.00, 15.00, 10.00);
INSERT INTO facility VALUES (11, 'Great Falls Park Main Entrance', 102, 1, 40.00, 25.00, 10.00);
INSERT INTO facility VALUES (12, 'Centennial Park Main Entrance', 103, 1, 35.00, 20.00, 10.00);
INSERT INTO facility VALUES (13, 'Patterson Park Main Entrance', 104, 1, 30.00, 15.00, 10.00);

-- Type 2: Campsites (5)
INSERT INTO facility VALUES (3, 'Patapsco Valley Campground A', 100, 2, 50.00, NULL, 25.00);
INSERT INTO facility VALUES (4, 'Shenandoah Campground B', 101, 2, 45.00, NULL, 20.00);
INSERT INTO facility VALUES (5, 'Great Falls Campground C', 102, 2, 55.00, NULL, 25.00);
INSERT INTO facility VALUES (14, 'Centennial Campground D', 103, 2, 40.00, NULL, 20.00);
INSERT INTO facility VALUES (15, 'Patterson Campground E', 104, 2, 48.00, NULL, 22.00);

-- Type 3: Tours (5)
INSERT INTO facility VALUES (6, 'Patapsco Valley Wildlife Tour', 100, 3, 75.00, 45.00, 30.00);
INSERT INTO facility VALUES (7, 'Shenandoah Tour', 101, 3, 85.00, 50.00, 35.00);
INSERT INTO facility VALUES (8, 'Great Falls Tour', 102, 3, 70.00, 40.00, 30.00);
INSERT INTO facility VALUES (16, 'Centennial Tour', 103, 3, 65.00, 35.00, 25.00);
INSERT INTO facility VALUES (17, 'Patterson Tour', 104, 3, 80.00, 48.00, 30.00);

-- Type 4: Parking Lots (5)
INSERT INTO facility VALUES (9, 'Patapsco Valley Parking Lot 1', 100, 4, 20.00, NULL, 5.00);
INSERT INTO facility VALUES (10, 'Shenandoah Parking Lot 1', 101, 4, 15.00, NULL, 5.00);
INSERT INTO facility VALUES (18, 'Great Falls Parking Lot 1', 102, 4, 25.00, NULL, 5.00);
INSERT INTO facility VALUES (19, 'Centennial Parking Lot 1', 103, 4, 15.00, NULL, 5.00);
INSERT INTO facility VALUES (20, 'Patterson Parking Lot 1', 104, 4, 10.00, NULL, 5.00);

INSERT INTO campsite VALUES (3, 6);
INSERT INTO campsite VALUES (4, 8);
INSERT INTO campsite VALUES (5, 4);
INSERT INTO campsite VALUES (14, 6);
INSERT INTO campsite VALUES (15, 10);

CREATE TABLE parking_lot (
    facility_id       NUMBER PRIMARY KEY,
    capacity          NUMBER NOT NULL,
    spots_taken       NUMBER NOT NULL,
    status NUMBER CHECK (status IN (1,2,3,4)),
    
    CONSTRAINT fk_parking_facility 
        FOREIGN KEY (facility_id) REFERENCES facility(facility_id),
    
    CONSTRAINT chk_spots 
        CHECK (spots_taken <= capacity)
);


INSERT INTO parking_lot VALUES (9, 100, 90, 1);
INSERT INTO parking_lot VALUES (10, 80, 80, 3);
INSERT INTO parking_lot VALUES (18, 50, 46, 4);
INSERT INTO parking_lot VALUES (19, 70, 20, 1);
INSERT INTO parking_lot VALUES (20, 60, 60, 3);

CREATE TABLE tour (
    facility_id            NUMBER PRIMARY KEY,
    tour_duration_minutes  NUMBER NOT NULL,
    
    CONSTRAINT fk_tour_facility 
        FOREIGN KEY (facility_id) REFERENCES facility(facility_id)
);

INSERT INTO tour VALUES (6, 120);
INSERT INTO tour VALUES (7, 180);
INSERT INTO tour VALUES (8, 90);
INSERT INTO tour VALUES (16, 60);
INSERT INTO tour VALUES (17, 150);


--- Table Tour_detail

CREATE TABLE tour_detail (
    facility_id NUMBER,
    start_time TIMESTAMP,
    capacity NUMBER,
    available_spots NUMBER,
    CONSTRAINT pk_tour_detail
        PRIMARY KEY (facility_id, start_time),
    CONSTRAINT fk_tourdetail_facility
        FOREIGN KEY (facility_id)
        REFERENCES facility(facility_id)
);

INSERT INTO tour_detail VALUES (6, TIMESTAMP '2026-04-01 09:00:00', 20, 15);
INSERT INTO tour_detail VALUES (6, TIMESTAMP '2026-04-01 13:00:00', 20, 10);
INSERT INTO tour_detail VALUES (7, TIMESTAMP '2026-04-02 10:00:00', 25, 20);
INSERT INTO tour_detail VALUES (8, TIMESTAMP '2026-04-03 11:00:00', 30, 25);
INSERT INTO tour_detail VALUES (7, TIMESTAMP '2026-04-04 14:00:00', 15, 10);

--- Table Transaction 

CREATE TABLE transaction (
    transaction_id NUMBER PRIMARY KEY,
    visitor_id NUMBER,
    transaction_type NUMBER,
    facility_id NUMBER,
    start_time TIMESTAMP,
    number_of_days NUMBER,
    num_adults NUMBER,
    num_children NUMBER,
    total_price NUMBER,
    status NUMBER,
    FOREIGN KEY (visitor_id) REFERENCES visitor(visitor_id),
    FOREIGN KEY (facility_id) REFERENCES facility(facility_id)
);


INSERT INTO transaction VALUES (1, 100, 1, 1, SYSDATE, 1, 2, 1, 90, 2);
INSERT INTO transaction VALUES (2, 101, 2, 3, SYSDATE, 2, 2, 0, 100, 1);
INSERT INTO transaction VALUES (3, 102, 3, 6, SYSDATE, 1, 3, 1, 280, 2);
INSERT INTO transaction VALUES (4, 103, 4, 9, SYSDATE, 1, 1, 0, 10, 1);
INSERT INTO transaction VALUES (5, 104, 2, 4, SYSDATE, 3, 2, 2, 135, 1);


--- Table Message

CREATE TABLE message (
    message_id NUMBER PRIMARY KEY,
    visitor_id NUMBER,
    message_time TIMESTAMP,
    message_body VARCHAR2(400),
    FOREIGN KEY (visitor_id) REFERENCES visitor(visitor_id)
);

INSERT INTO message VALUES (1, 100, SYSTIMESTAMP, 'Welcome to the park');
INSERT INTO message VALUES (2, 101, SYSTIMESTAMP, 'Reservation confirmed');
INSERT INTO message VALUES (3, 102, SYSTIMESTAMP, 'Tour booked successfully');
INSERT INTO message VALUES (4, 103, SYSTIMESTAMP, 'Parking reserved');
INSERT INTO message VALUES (5, 104, SYSTIMESTAMP, 'Campsite booking completed');
INSERT INTO message VALUES (6, 104, SYSTIMESTAMP, 'Parking reserved');




-- Create sequence for automatically generating
-- unique message IDs for confirmation/cancellation messages
CREATE SEQUENCE message_seq
START WITH 6
INCREMENT BY 1;
-- Create sequence for automatically generating
-- unique transaction IDs for new reservations

CREATE SEQUENCE transaction_seq
START WITH 6
INCREMENT BY 1;

-- Create sequence for automatically generating
-- unique visitor IDs for new visitors

CREATE SEQUENCE visitor_seq
START WITH 105
INCREMENT BY 1;

/* 
Feature 1: Add a visitor
Description: Adding a new visitor to the system, which will check if any visitor with an identical email address exists. If the visitor exists, their related info of address, zipcode, and state will be updated. If the visitor itself isn???t there at all, a brand new visitor ID(using sequence) is generated with inserting a new row into the visitor table

Input Parameters: visitor_name, visitor_email, address, state, zipcode

Outputs:
 ???the visitor already exists??? when system finds that visitor with same email is present and a newly generated ID is output if the visitor does not exist
*/

create or replace procedure add_visitor( --all variables are in varchar2 to preserve its plain text formal well
    v_name varchar2, --complete name of the visitor
    v_email varchar2, --email of the visitor
    v_address varchar2, --complete address of the visitor
    v_state varchar2, --the visitor's residing state
    v_zipcode varchar2 --the visitor's residing zip code
)
as 
v_count int;
v_vid int;
begin 
 select count(*) into v_count from visitor where visitor_email = v_email;
 
 if v_count > 0 then -- Based on that count, if it's greater than zero, message will be outputted that the visitor exists
  dbms_output.put_line('the visitor already exists');
  
  update visitor --Since visitor exists, their address, zip code, and state is updated with keeping in mind that the visitor's email already exists
  set address = v_address, state = v_state, zipcode = v_zipcode 
  where visitor_email = v_email;
 else 
  v_vid := visitor_seq.nextval;
  
  insert into visitor (visitor_id, visitor_name, visitor_email, address, state, zipcode) --the new visitor's information is updated into the database
  values (v_vid, v_name, v_email, v_address, v_state, v_zipcode);
  
  dbms_output.put_line('New visitor ID is ' || v_vid);
 end if; 
end;
/

/* 
Feature 2: List all transactions placed by a visitor
Description: Based on a visitor???s name, this feature will bring out the list of all past transactions of the visitor and perform proper verification in the database to make sure that the visitor exists in the first place, so no compilation errors occur.
Input Parameters: visitor_name
Outputs: 
Upon the user???s input of a visitor name, and there???s no match, it???ll print out ???no such visitor??? and stop running. 
If there is a visitor who exists upon seeing the user input, the list of transactions placed by the visitor will be printed out. In that list, the main contents of it are the transaction_id, transaction_type, facility_name, start_time, number_of_days, status, and the total_price
*/
Create or replace procedure list_visitor_transactions(v_name in visitor.visitor_name%type) --procedure is created to commonly check all visitor transactions
is
-- explicit cursor is created to read through every row of transactions in detail by having multiple joins to connect transaction, facility, and visitor tables in one place by their PK/FK being connected together with multiple =
cursor c1 is select t.transaction_id, t.transaction_type, f.facility_name, 
t.start_time, t.number_of_days, t.status, t.total_price
from transaction t, facility f, visitor v
where t.facility_id = f.facility_id and t.visitor_id = v.visitor_id and v.visitor_name = v_name;

-- Having our variables using %type to prevent any potential errors from happening if any table formatting were to change and made sure that our code always matches with the table if edits were to be made
v_tid transaction.transaction_id%type;
v_ttype transaction.transaction_type%type;
v_fname facility.facility_name%type;
v_start transaction.start_time%type;
v_days transaction.number_of_days%type;
v_status transaction.status%type;
v_total transaction.total_price%type;
v_vid visitor.visitor_id%type;

begin
 -- Before the loop is set, we need to check if the visitor ID actually exists in the system. If it doesn't, it redirects to the exception set in the end to inform the user that the visitor doesn't exist
 select visitor_id into v_vid from visitor where visitor_name = v_name;
 
 dbms_output.put_line('Transactions for ' || v_name || ':');
 
 open c1;
 loop
  fetch c1 into v_tid, v_ttype, v_fname, v_start, v_days, v_status, v_total;
  exit when c1%notfound;
  dbms_output.put_line('Trans ID: ' || v_tid || 
                       ' | Trans Type: ' || v_ttype || 
                       ' | Facility: ' || v_fname || 
                       ' | Start: ' || to_char(v_start, 'YYYY-MM-DD HH24:MI') || 
                       ' | Days: ' || v_days || 
                       ' | Status: ' || v_status || 
                       ' | Total: $' || v_total);
 end loop;
 close c1;
 
-- If there's no match of the visitor with the inputted name by the user, system redirects to this exception and informs the user that there's no such visitor in the database.
exception 
 when no_data_found then 
  dbms_output.put_line('No such visitor');
end;
/


SET SERVEROUTPUT ON;

--------------------------------------------------------------------------------
-- FEATURE 3 : list_park_tours                              --------------------------------------------------------------------------------
-- Description:
--   Given a park name, check whether a park with that name exists.
--     - If not, print 'No such park'.
--     - If the park exists, print the tour name and duration (minutes) of
--       every tour facility (facility_type = 3) in that park.
--
-- Input:
--   p_park_name  VARCHAR2 -- Name of the park
--
-- Output (via DBMS_OUTPUT):
--   'No such park'  if the park does not exist
--   One line per tour: <tour_name>  <duration_minutes>

CREATE OR REPLACE PROCEDURE list_park_tours(
    p_park_name IN VARCHAR2)
IS
    v_park_id NUMBER;

    -- Cursor: every tour facility in the resolved park
    CURSOR c_tours IS
        SELECT f.facility_name AS tour_name,
               t.tour_duration_minutes AS duration_min
        FROM facility f
        JOIN tour t ON f.facility_id = t.facility_id
        WHERE f.park_id = v_park_id
          AND f.facility_type = 3
        ORDER BY f.facility_name;
BEGIN
    -- Step 1: verify park exists and get its id
    BEGIN
        SELECT park_id
        INTO v_park_id
        FROM park
        WHERE park_name = p_park_name;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            DBMS_OUTPUT.PUT_LINE('No such park');
            RETURN;
    END;

    -- Step 2: print header
    DBMS_OUTPUT.PUT_LINE(RPAD('Tour Name', 40) || 'Duration (minutes)');
    DBMS_OUTPUT.PUT_LINE(RPAD('-', 40, '-')   || '------------------');

    -- Step 3: loop and print each tour
    FOR rec IN c_tours LOOP
        DBMS_OUTPUT.PUT_LINE(RPAD(rec.tour_name, 40) || rec.duration_min);
    END LOOP;
END list_park_tours;
/

--------------------------------------------------------------------------------
-- FEATURE 4 : list_available_tours                          
--------------------------------------------------------------------------------
-- Description:
--   Given a tour name, a date, and a required number of spots:
--     - If no tour with that name exists, print 'No such a tour'.
--     - Otherwise, search tour_detail for sessions on that date whose
--       available_spots >= p_spots and print them.
--     - If none qualify, print 'No tour has enough spots'.
--
-- Inputs:
--   p_tour_name  VARCHAR2 -- Tour name (must match facility_name where type=3)
--   p_date       DATE     -- Day to search
--   p_spots      NUMBER   -- Minimum required available spots
--
-- Output (via DBMS_OUTPUT):
--   'No such a tour' OR matching start times and available spots
--   OR 'No tour has enough spots'
CREATE OR REPLACE PROCEDURE list_available_tours (
    p_tour_name IN VARCHAR2,
    p_date IN DATE,
    p_spots IN NUMBER)
IS
    v_facility_id NUMBER;
    v_found BOOLEAN := FALSE;

    -- Cursor: sessions of this tour on p_date with enough spots
    CURSOR c_avail IS
        SELECT td.start_time,
               td.available_spots
        FROM tour_detail td
        WHERE td.facility_id = v_facility_id
          AND TRUNC(td.start_time) = p_date
          AND td.available_spots >= p_spots
        ORDER BY td.start_time;
BEGIN
    -- Step 1: verify the tour exists
    BEGIN
        SELECT f.facility_id
        INTO v_facility_id
        FROM facility f
        WHERE f.facility_name = p_tour_name
          AND f.facility_type = 3;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            DBMS_OUTPUT.PUT_LINE('No such tour');
            RETURN;
    END;

    -- Step 2: print header
    DBMS_OUTPUT.PUT_LINE(RPAD('Start Time', 25) || 'Available Spots');
    DBMS_OUTPUT.PUT_LINE(RPAD('-', 25, '-') || '---------------');

    -- Step 3: print every matching session
    FOR rec IN c_avail LOOP
        DBMS_OUTPUT.PUT_LINE(
            RPAD(TO_CHAR(rec.start_time, 'YYYY-MM-DD HH24:MI:SS'), 25)
            || rec.available_spots
        );
        v_found := TRUE;
    END LOOP;

    -- Step 4: if nothing matched, print the special message
    IF NOT v_found THEN
        DBMS_OUTPUT.PUT_LINE('No tour has enough spots');
    END IF;
END list_available_tours;
/

/*
Procedure Name: list_parking_lots

Description:
This procedure lists all parking lots available
in a given park along with their status.

The procedure:
1. Checks whether the input park exists
2. Retrieves all parking lots in that park
3. Displays parking lot names and status labels
   (open, closed, full, limited)Input:
- p_park_name : Name of the park entered by the user

Expected Output:
- If the park does not exist:
"No such park"

- If parking lots exist:
Displays:
Parking Lot Name | Status

Example:
North Parking Lot | Open
Visitor Parking | Full

- If no parking lots are available in the park:
"No parking lots found" 
*/
CREATE OR REPLACE PROCEDURE list_parking_lots (
    p_park_name IN VARCHAR2
)
IS
    v_count NUMBER;

    -- Cursor to get parking lots and status, Facility type 4 is parking lot
    CURSOR parking_cursor IS
        SELECT f.facility_name,
               pl.status
        FROM facility f
        JOIN parking_lot pl
             ON f.facility_id = pl.facility_id
        JOIN park p
             ON f.park_id = p.park_id
        WHERE p.park_name = p_park_name
          AND f.facility_type = 4;

    v_facility_name facility.facility_name%TYPE;
    v_status parking_lot.status%TYPE;

BEGIN
    --------------------------------------------------
    -- Step 1: Check if park exists
    --------------------------------------------------
    SELECT COUNT(*)
    INTO v_count
    FROM park
    WHERE park_name = p_park_name;

    IF v_count = 0 THEN
        DBMS_OUTPUT.PUT_LINE('No such park');
        RETURN;
    END IF;

    --------------------------------------------------
    -- Step 2: Open cursor and print parking lots
    --------------------------------------------------
    DBMS_OUTPUT.PUT_LINE('Parking Lot Name | Status');

    OPEN parking_cursor;

    LOOP
        FETCH parking_cursor
        INTO v_facility_name, v_status;

        EXIT WHEN parking_cursor%NOTFOUND;

        DBMS_OUTPUT.PUT_LINE(
            v_facility_name || ' | ' ||

            CASE v_status
                WHEN 1 THEN 'open'
                WHEN 2 THEN 'closed'
                WHEN 3 THEN 'full'
                WHEN 4 THEN 'limited'
            END
        );

    END LOOP;

    CLOSE parking_cursor;

END;
/

/*
Procedure Name: update_parking_status

Description:
This procedure updates the number of spots taken
for a parking lot and automatically updates
its status based on parking capacity.

Status Rules:
1 = Open
2 = Closed
3 = Full
4 = Limited

The procedure:
1. Validates the parking lot facility ID
2. Updates spots_taken
3. Updates parking status according to capacityInput:
- p_facility_id : Parking lot facility ID
- p_spots_taken : Updated number of occupied parking spots

Expected Output:
- If the parking lot does not exist:
"Invalid parking facility ID"

- If spots_taken exceeds total capacity:
"Spots taken cannot exceed total parking capacity"

- If update is successful:
Displays updated parking lot status

Example:
Parking status updated successfully
Current Status: Full

Possible Status Outputs:
- Open
- Closed
- Full
- Limited 
*/

CREATE OR REPLACE PROCEDURE update_parking_status (
    p_facility_id IN NUMBER,
    p_spots_taken IN NUMBER
)
IS
    v_capacity parking_lot.capacity%TYPE;
    v_count NUMBER;

BEGIN
    --------------------------------------------------
    -- Step 1: Check if parking lot exists
    --------------------------------------------------
    SELECT COUNT(*)
    INTO v_count
    FROM parking_lot
    WHERE facility_id = p_facility_id;

    IF v_count = 0 THEN
        DBMS_OUTPUT.PUT_LINE('Invalid facility ID');
        RETURN;
    END IF;

    --------------------------------------------------
    -- Step 2: Get parking lot capacity
    --------------------------------------------------
    SELECT capacity
    INTO v_capacity
    FROM parking_lot
    WHERE facility_id = p_facility_id;

    --------------------------------------------------
    -- Step 3: Update spots_taken
    --------------------------------------------------
    UPDATE parking_lot
    SET spots_taken = p_spots_taken
    WHERE facility_id = p_facility_id;

    --------------------------------------------------
    -- Step 4: Update status based on capacity
    --------------------------------------------------
    IF p_spots_taken >= v_capacity THEN
    -- setting status as "Full"

        UPDATE parking_lot
        SET status = 3
        WHERE facility_id = p_facility_id;

        DBMS_OUTPUT.PUT_LINE('The parking lot becomes full');

    ELSIF p_spots_taken >= 0.9 * v_capacity THEN
    --setting status as "Limited"

        UPDATE parking_lot
        SET status = 4
        WHERE facility_id = p_facility_id;

        DBMS_OUTPUT.PUT_LINE('The parking lot becomes limited');

    ELSE
    --set status as "Open"
        UPDATE parking_lot
        SET status = 1
        WHERE facility_id = p_facility_id;

        DBMS_OUTPUT.PUT_LINE('The parking lot is open');

    END IF;

END;
/


SET SERVEROUTPUT ON;

/*
Procedure Name: statistics_report

Description:
This procedure prints statistics for each park
between the input start date and end date.

The procedure:
1. Prints park name, total uncanceled transactions, and total prices
2. Prints total number of visitors
3. Prints most reserved campsite
4. Prints most reserved tour
*/

CREATE OR REPLACE PROCEDURE statistics_report (
    p_start_date IN DATE,
    p_end_date   IN DATE
)
IS
BEGIN
    DBMS_OUTPUT.PUT_LINE('Statistics Report for Parks');
    DBMS_OUTPUT.PUT_LINE('Date Range: ' || TO_CHAR(p_start_date, 'YYYY-MM-DD') ||
                         ' to ' || TO_CHAR(p_end_date, 'YYYY-MM-DD'));

    FOR rec IN (
        SELECT
            p.park_id,
            p.park_name,
            COUNT(t.transaction_id) AS total_transactions,
            NVL(SUM(t.total_price), 0) AS total_price,
            NVL(SUM(
                CASE
                    WHEN t.transaction_type = 1
                    THEN NVL(t.num_adults, 0) + NVL(t.num_children, 0)
                    ELSE 0
                END
            ), 0) AS total_visitors
        FROM park p
        LEFT JOIN facility f
            ON p.park_id = f.park_id
        LEFT JOIN transaction t
            ON f.facility_id = t.facility_id
           AND t.status <> 3
           AND t.start_time >= CAST(p_start_date AS TIMESTAMP)
           AND t.start_time < CAST(p_end_date + 1 AS TIMESTAMP)
        GROUP BY p.park_id, p.park_name
        ORDER BY p.park_id
    )
    LOOP
        DBMS_OUTPUT.PUT_LINE(' ');
        DBMS_OUTPUT.PUT_LINE('Park Summary');
        DBMS_OUTPUT.PUT_LINE('Park Name: ' || rec.park_name);
        DBMS_OUTPUT.PUT_LINE('Total Uncanceled Transactions: ' || rec.total_transactions);
        DBMS_OUTPUT.PUT_LINE('Total Price: ' || rec.total_price);
        DBMS_OUTPUT.PUT_LINE('Total Visitors: ' || rec.total_visitors);

        -- Step 2: Find most reserved campsite for the park
        DECLARE
            v_campsite facility.facility_name%TYPE;
        BEGIN
            SELECT facility_name
            INTO v_campsite
            FROM (
                SELECT f.facility_name, COUNT(*) AS reservation_count
                FROM facility f
                JOIN transaction t
                    ON f.facility_id = t.facility_id
                WHERE f.park_id = rec.park_id
                  AND f.facility_type = 2
                  AND t.transaction_type = 2
                  AND t.status <> 3
                  AND t.start_time >= CAST(p_start_date AS TIMESTAMP)
                  AND t.start_time < CAST(p_end_date + 1 AS TIMESTAMP)
                GROUP BY f.facility_name
                ORDER BY reservation_count DESC
            )
            WHERE ROWNUM = 1;

            DBMS_OUTPUT.PUT_LINE('Campsite Reservation Result: ' || v_campsite);
        EXCEPTION
            WHEN NO_DATA_FOUND THEN
                DBMS_OUTPUT.PUT_LINE('Campsite Reservation Result: None');
        END;

        -- Step 3: Find most reserved tour for the park
        DECLARE
            v_tour facility.facility_name%TYPE;
        BEGIN
            SELECT facility_name
            INTO v_tour
            FROM (
                SELECT f.facility_name, COUNT(*) AS reservation_count
                FROM facility f
                JOIN transaction t
                    ON f.facility_id = t.facility_id
                WHERE f.park_id = rec.park_id
                  AND f.facility_type = 3
                  AND t.transaction_type = 3
                  AND t.status <> 3
                  AND t.start_time >= CAST(p_start_date AS TIMESTAMP)
                  AND t.start_time < CAST(p_end_date + 1 AS TIMESTAMP)
                GROUP BY f.facility_name
                ORDER BY reservation_count DESC
            )
            WHERE ROWNUM = 1;

            DBMS_OUTPUT.PUT_LINE('Tour Reservation Result: ' || v_tour);
        EXCEPTION
            WHEN NO_DATA_FOUND THEN
                DBMS_OUTPUT.PUT_LINE('Tour Reservation Result: None');
        END;

    END LOOP;
END;
/

/*
Feature 8: List all campsites available in a park on a given date range. The input includes a park name, start date, end date, and number of people.
Description: In this feature, upon the user???s request for a specific park that they are interested in, it searches for that respective park???s availability of campsites on the date range constraint that they choose and the number of people in their party. Based on space availability by time/space and conflicting reservations, the user can get multiple types of answers. 

Input Parameters: park_name, start_date, end_date, num_people
Outputs: 
If there isn???t any park that matches the user???s request, print ???no such park???. 
If the campsites of the park have >= capacity of people, print ???no matches found???. 
If conflicting reservations exist, check the reservation type and duration overlap with all being booked, print ???no matches???
If there were to be no conflicts and available ones are found, print out the campsite name and the maximum number of people it has the capacity to fit in

*/
Create or replace procedure list_available_campsites( --creating a procedure to view available campsites
    v_pname in park.park_name%type,--Park's full name
    v_start_dat in varchar2, -- start date of the chosen availability range
    v_end_dat in varchar2, -- end date of the chosen availability range
    v_people in number --number of people the user wants to occupy in campsite
)

is
 v_count int;
 v_conflict_count int;
 v_actual_count int := 0;
 
 v_start date;
 v_end date;
 -- Having our variables using %type to prevent any potential errors from happening if any table formatting were to change and made sure that our code always matches with the table if edits were to be made which helps fetch our cursor-related data easily
 v_fid facility.facility_id%type;
 v_fname facility.facility_name%type;
 v_max campsite.max_people%type;

 -- An explicit cursor made to search for campsites in this park that have the maximal number of people greater than or equal to the number of people in the input where data is fetched from facility, campsite, and park tables with common points being linked together by =
 cursor c1 is 
  select f.facility_id, f.facility_name, c.max_people
  from facility f, campsite c, park p
  where f.facility_id = c.facility_id 
    and f.park_id = p.park_id 
    and p.park_name = v_pname
    and c.max_people >= v_people;

begin
 -- User's date input is converted to meet the DBMS requirements of proper data formatting
 v_start := to_date(v_start_dat, 'YYYY-MM-DD');
 v_end := to_date(v_end_dat, 'YYYY-MM-DD');
 
   -- Validate date range
    if v_start >= v_end then
        DBMS_OUTPUT.PUT_LINE('Invalid date range');
        return;
    end if;


 -- When the user immediately sends in their input, system checks to see if that park actually exists in the database
 select count(*) into v_count from park where park_name = v_pname;
 if v_count = 0 then 
  dbms_output.put_line('No such park.');
  return;
 end if;

 -- Connecting back to our cursor loop, we look through it once to see if overall all of the campsites are available/empty to meet the user's requested needed people count initially before proceeding on further
 select count(*) into v_count
 from facility f, campsite c, park p
 where f.facility_id = c.facility_id 
   and f.park_id = p.park_id 
   and p.park_name = v_pname
   and c.max_people >= v_people;

 if v_count = 0 then 
  dbms_output.put_line('No matches found');
  return; 
 end if;
 -- Print out the vacant campsites available for the user to see what's available in their given date range
 dbms_output.put_line('Vacant Campsites in ' || v_pname || ':');
 
 open c1;
 loop
  fetch c1 into v_fid, v_fname, v_max;
  exit when c1%notfound;
  
  -- Check for conflicting reservations related to the campsite by seeing what present transactions are intersecting with what the user specifies in their given date range
  select count(*) into v_conflict_count
  from transaction t
  where t.facility_id = v_fid
    and t.transaction_type = 2 --special condition set in place where the exact facility shouls match via its ID, transaction with type 2 which relates to reserving a campsite and status is not 3 for this campsite where it shouldn't be cancelled at all 
    and t.status <> 3
    and v_start < (trunc(t.start_time) + numtodsinterval(t.number_of_days, 'DAY')) -- To check if the user's chosen data is actually preceding an already present transaction, trunc is used to return date from a timestamp while numtodsinterval convert an integer to interval day type. 
    and trunc(t.start_time) < v_end;
    
  -- If no conflicting reservation, print out the campsite name and maximum number of people.
  if v_conflict_count = 0 then
   dbms_output.put_line(v_fname || ' (Maximum Number of People Campsite can fill: ' || v_max || ')');
   v_actual_count := v_actual_count + 1;
  end if;
  
 end loop;
 close c1;
 
 -- If all of the data entries are analyzed but there's an date overlap due to conflicts that are present, print 'No matches found' and stop.
 if v_actual_count = 0 then
  dbms_output.put_line('No matches');
 end if;
 
 exception

    when others then
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);

end;
/


-------------------------------------------------------------------
-- FEATURE 9 : reserve_campsite                              
-------------------------------------------------------------------
-- Description:
--   Reserve a campsite for a visitor. Performs the following checks in order:
--     1. Campsite (facility_id) must exist in the campsite table.
--     2. Visitor (visitor_id) must exist.
--     3. max_people of the campsite >= num_adults + num_children.
--     4. No active campsite reservation on this facility whose duration
--        overlaps with the requested duration.
--   If all checks pass:
--     - Compute total_price = number_of_days * daily_price.
--     - INSERT a new row into transaction (status=1, check-in time = 3 PM).
--     - INSERT a confirmation row into message.
--     - Print 'Reservation successful! Total price: $X'.
--
-- Overlap rule (per project spec):
--   TRUNC(existing.start_time) < p_start_date + p_num_days
--   AND p_start_date          < TRUNC(existing.start_time) + existing.number_of_days
--
-- Inputs:
--   p_facility_id   NUMBER -- Campsite facility id
--   p_visitor_id    NUMBER -- Visitor id
--   p_start_date    DATE   -- Reservation start date
--   p_num_days      NUMBER -- Number of days
--   p_num_adults    NUMBER -- Number of adults
--   p_num_children  NUMBER -- Number of children
--
-- Output (via DBMS_OUTPUT):
--   One of: 'No such campsite' / 'No such visitor' / 'Insufficient capacity'
--           / 'The campsite is not available due to a conflict'
--           / 'Reservation successful! Total price: $<amount>'
--------------------------------------------------------------------------------
CREATE OR REPLACE PROCEDURE reserve_campsite (
    p_facility_id IN NUMBER,
    p_visitor_id IN NUMBER,
    p_start_date IN DATE,
    p_num_days IN NUMBER,
    p_num_adults IN NUMBER,
    p_num_children IN NUMBER
)
IS
    v_max_people NUMBER;
    v_daily_price NUMBER(10,2);
    v_facility_name VARCHAR2(100);
    v_visitor_count NUMBER;
    v_total_people NUMBER;
    v_conflict_count NUMBER;
    v_total_price NUMBER(10,2);
BEGIN
    -- Step 1: campsite must exist
    BEGIN
        SELECT c.max_people, f.daily_price, f.facility_name
        INTO v_max_people, v_daily_price, v_facility_name
        FROM campsite c
        JOIN facility f ON c.facility_id = f.facility_id
        WHERE c.facility_id = p_facility_id;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            DBMS_OUTPUT.PUT_LINE('No such campsite');
            RETURN;
    END;

    -- Step 2: visitor must exist
    SELECT COUNT(*)
    INTO v_visitor_count
    FROM visitor
    WHERE visitor_id = p_visitor_id;

    IF v_visitor_count = 0 THEN
        DBMS_OUTPUT.PUT_LINE('No such visitor');
        RETURN;
    END IF;

    -- Step 3: capacity check
    v_total_people := p_num_adults + p_num_children;

    IF v_max_people < v_total_people THEN
        DBMS_OUTPUT.PUT_LINE('Insufficient capacity');
        RETURN;
    END IF;

    -- Step 4: overlap / conflict check
    --   Active = transaction_type = 2 AND status <> 3
    SELECT COUNT(*)
    INTO v_conflict_count
    FROM transaction t
    WHERE t.facility_id = p_facility_id
      AND t.transaction_type = 2
      AND t.status <> 3
      AND TRUNC(t.start_time) < p_start_date + p_num_days
      AND p_start_date < TRUNC(t.start_time) + t.number_of_days;

    IF v_conflict_count > 0 THEN
        DBMS_OUTPUT.PUT_LINE('The campsite is not available due to a conflict');
        RETURN;
    END IF;

    -- Step 5: compute total price
    v_total_price := p_num_days * v_daily_price;

    -- Step 6: insert reservation row
    --   start_time stored as p_start_date + 15 hours (3 PM check-in)
    INSERT INTO transaction (
        transaction_id, visitor_id, transaction_type, facility_id,
        start_time, number_of_days, num_adults, num_children,
        total_price, status
    )
    VALUES (
        transaction_seq.NEXTVAL,
        p_visitor_id,
        2,
        p_facility_id,
        p_start_date + INTERVAL '15' HOUR,
        p_num_days,
        p_num_adults,
        p_num_children,
        v_total_price,
        1
    );

    -- Step 7: confirmation message
    INSERT INTO message (
        message_id, visitor_id, message_time, message_body
    )
    VALUES (
        message_seq.NEXTVAL,
        p_visitor_id,
        SYSTIMESTAMP,
        'Thanks for reserving campsite ' || v_facility_name ||
        ' from ' || TO_CHAR(p_start_date, 'YYYY-MM-DD') ||
        ' for ' || p_num_days || ' days'
    );

    COMMIT;

    -- Step 8: print success
    DBMS_OUTPUT.PUT_LINE(
        'Reservation successful! Total price: $' || TO_CHAR(v_total_price)
    );
END reserve_campsite;
/


/*
Procedure Name: reserve_tour

Description:
This procedure reserves a tour for a visitor.
It validates whether:
1. The tour facility exists
2. The visitor exists
3. A tour is available at the given start time
4. Sufficient spots are available

If all validations pass, the procedure:
- Calculates total reservation price
- Inserts a new transaction record
- Updates available spots in tour_detail
- Inserts a confirmation message into the message table

Input:
- p_facility_id : Tour facility ID
- p_visitor_id : Visitor ID
- p_start_time : Tour start timestamp
- p_num_adults : Number of adults
- p_num_children : Number of children

Expected Output:
- If the tour facility does not exist:
"No such tour"

- If the visitor does not exist:
"No such visitor"

- If no tour exists at the specified time:
"No tour at the given time"

- If available spots are insufficient:
"Insufficient capacity"

- If reservation is successful:
Displays:
"Tour reserved successfully"

A new transaction record is inserted
Available spots are reduced
A confirmation message is created

Example Successful Output:
Tour reserved successfully

Example Confirmation Message:
Thanks for reserving tour Yellowstone Adventure
started at 2026-04-01 09:00:00 
*/

CREATE OR REPLACE PROCEDURE reserve_tour (
    p_facility_id   IN NUMBER,
    p_visitor_id    IN NUMBER,
    p_start_time    IN TIMESTAMP,
    p_num_adults    IN NUMBER,
    p_num_children  IN NUMBER
)
IS
    v_count NUMBER;
    v_available_spots NUMBER;
    v_total_people NUMBER;
    v_daily_price NUMBER(10,2);
    v_child_price NUMBER(10,2);
    v_total_price NUMBER(10,2);
    v_facility_name VARCHAR2(100);

BEGIN
    --------------------------------------------------
    -- Step 1: Check if tour exists, facility type 3 is "Tour"
    --------------------------------------------------
    SELECT COUNT(*)
    INTO v_count
    FROM facility
    WHERE facility_id = p_facility_id
      AND facility_type = 3;

    IF v_count = 0 THEN
        DBMS_OUTPUT.PUT_LINE('No such tour');
        RETURN;
    END IF;

    --------------------------------------------------
    -- Step 2: Check if visitor exists
    --------------------------------------------------
    SELECT COUNT(*)
    INTO v_count
    FROM visitor
    WHERE visitor_id = p_visitor_id;

    IF v_count = 0 THEN
        DBMS_OUTPUT.PUT_LINE('No such visitor');
        RETURN;
    END IF;

    --------------------------------------------------
    -- Step 3: Check if tour exists at given time
    --------------------------------------------------
    SELECT COUNT(*)
    INTO v_count
    FROM tour_detail
    WHERE facility_id = p_facility_id
      AND start_time = p_start_time;

    IF v_count = 0 THEN
        DBMS_OUTPUT.PUT_LINE('No tour at the given time');
        RETURN;
    END IF;

    --------------------------------------------------
    -- Step 4: Check available spots
    --------------------------------------------------
    SELECT available_spots
    INTO v_available_spots
    FROM tour_detail
    WHERE facility_id = p_facility_id
      AND start_time = p_start_time;

    v_total_people := p_num_adults + p_num_children;
    IF v_total_people <= 0 THEN --In case input is negative number

        DBMS_OUTPUT.PUT_LINE('Invalid number of people');

        RETURN;

    END IF;

    IF v_available_spots < v_total_people THEN
        DBMS_OUTPUT.PUT_LINE('Insufficient capacity');
        RETURN;
    END IF;

    --------------------------------------------------
    -- Step 5: Compute total price
    --------------------------------------------------
    SELECT daily_price,
           child_price,
           facility_name
    INTO v_daily_price,
         v_child_price,
         v_facility_name
    FROM facility
    WHERE facility_id = p_facility_id;

    v_total_price :=
        (v_daily_price * p_num_adults) +
        (NVL(v_child_price,0) * p_num_children);

    --------------------------------------------------
    -- Step 6: Insert transaction
    --------------------------------------------------
    INSERT INTO transaction (
        transaction_id,
        visitor_id,
        transaction_type,
        facility_id,
        start_time,
        number_of_days,
        num_adults,
        num_children,
        total_price,
        status
    )
    VALUES (
    -- transaction_seq.NEXTVAL automatically generates
-- next unique transaction ID
        transaction_seq.NEXTVAL,
        p_visitor_id,
        3,
        p_facility_id,
        p_start_time,
        1,
        p_num_adults,
        p_num_children,
        v_total_price,
        1
    );

    --------------------------------------------------
    -- Step 7: Update available spots
    --------------------------------------------------
    -- Reduce available spots after reservation
    UPDATE tour_detail
    SET available_spots = available_spots - v_total_people
    WHERE facility_id = p_facility_id
      AND start_time = p_start_time;

    --------------------------------------------------
    -- Step 8: Insert message
    --------------------------------------------------
    INSERT INTO message (
        message_id,
        visitor_id,
        message_time,
        message_body
    )
    VALUES (
    -- message_seq.NEXTVAL automatically generates
-- the next unique message_id value
        message_seq.NEXTVAL,
        p_visitor_id,
        SYSTIMESTAMP,
        'Thanks for reserving tour ' ||
        v_facility_name ||
        ' started at ' ||
        TO_CHAR(p_start_time, 'YYYY-MM-DD HH24:MI:SS')
    );
    COMMIT;

    --------------------------------------------------
    -- Success message
    --------------------------------------------------
    DBMS_OUTPUT.PUT_LINE('Tour reserved successfully');
EXCEPTION

    --------------------------------------------------
    -- Handle unexpected errors
    --------------------------------------------------
    WHEN OTHERS THEN

        ROLLBACK;

        DBMS_OUTPUT.PUT_LINE(
            'Error: ' || SQLERRM
        );


END;
/

SET SERVEROUTPUT ON;

/*
Procedure Name: cancel_transaction

Description:
This procedure cancels a transaction.

The procedure:
1. Checks whether the transaction exists
2. Checks whether the transaction is already canceled
3. Updates the transaction status to canceled
4. Restores available tour spots if matching tour detail exists
5. Inserts a cancellation message into the message table
Input:
- p_transaction_id : Transaction ID to be canceled

Expected Output:
- If the transaction does not exist:
    "Transaction not found"

- If the transaction is already canceled:
    "Transaction already canceled"

- If cancellation is successful:
    Displays:
    "Transaction <transaction_id> status updated to canceled"
    "Cancellation message inserted successfully"

    Example:
    Transaction 3 status updated to canceled
    Cancellation message inserted successfully

- If transaction type is a tour reservation:
    Available spots are restored in tour_detail table

- A cancellation message is inserted into the message table:
    Example:
    "Your transaction 3 has been canceled"

- If unexpected error occurs:
    Displays Oracle error message
*/

CREATE OR REPLACE PROCEDURE cancel_transaction (
    p_transaction_id IN NUMBER
)
IS
    v_visitor_id        transaction.visitor_id%TYPE;
    v_transaction_type  transaction.transaction_type%TYPE;
    v_facility_id       transaction.facility_id%TYPE;
    v_start_time        transaction.start_time%TYPE;
    v_status            transaction.status%TYPE;
    v_num_adults        transaction.num_adults%TYPE;
    v_num_children      transaction.num_children%TYPE;
    v_message_id        NUMBER;
BEGIN
    -- Step 1: Get transaction details
    SELECT visitor_id,
           transaction_type,
           facility_id,
           start_time,
           status,
           num_adults,
           num_children
    INTO v_visitor_id,
         v_transaction_type,
         v_facility_id,
         v_start_time,
         v_status,
         v_num_adults,
         v_num_children
    FROM transaction
    WHERE transaction_id = p_transaction_id;

    -- Step 2: Check if already canceled
    IF v_status = 3 THEN
        DBMS_OUTPUT.PUT_LINE('Transaction already canceled');
        RETURN;
    END IF;

    -- Step 3: Update transaction status to canceled
    UPDATE transaction
    SET status = 3 --3 = canceled
    WHERE transaction_id = p_transaction_id;

    DBMS_OUTPUT.PUT_LINE('Transaction ' || p_transaction_id || ' status updated to canceled');

    -- Step 4: If transaction is tour reservation, restore available spots
    IF v_transaction_type = 3 THEN
        UPDATE tour_detail
        SET available_spots = available_spots + NVL(v_num_adults, 0) + NVL(v_num_children, 0)
        WHERE facility_id = v_facility_id
          AND start_time = v_start_time;
    END IF;

    v_message_id := message_seq.NEXTVAL;
    -- Step 5: Insert cancellation message
     INSERT INTO message (
        message_id,
        visitor_id,
        message_time,
        message_body
    )
    VALUES (
        v_message_id,
        v_visitor_id,
        SYSTIMESTAMP,
        'Your transaction '
        || p_transaction_id
        || ' has been canceled'
    );

    DBMS_OUTPUT.PUT_LINE(
        'Cancellation message inserted successfully'
    );

    COMMIT;

EXCEPTION
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('Transaction not found');
        
--------------------------------------------------
-- Any unexpected error
    --------------------------------------------------
    WHEN OTHERS THEN

        ROLLBACK;

        DBMS_OUTPUT.PUT_LINE(
            'Error: ' || SQLERRM
        );
END;
/

set serveroutput on;

-- normal case for brand new visitor 
exec add_visitor('Anita Sabriel', 'anisab@aol.com', '106 Hamburg St', 'MD', '21230');
-- Should see a new line inserted in visitor table and a new visitor ID printed for Anita (Visitor ID 105)
select * from visitor;

-- special case for existing user
select * from visitor where visitor_email = 'jbenson88@gmail.com';
exec add_visitor('Jeff Benson', 'jbenson88@gmail.com', '205 Lamar Ave', 'MD', '21260');
-- Should get the row updated and a message showing that the visitor already exists while address gets changed from Lennar to Lamar
select * from visitor;

--Test cases for demonstration
set serveroutput on;

-- normal case : Visitor with Transactions that already has their details stored within the system and once executed, their associated information of transaction id, transaction type, facility name, start_time, number of days, status, and total price is outputted.
exec list_visitor_transactions('Alice Smith');

-- special case : visitor with no transactions to how the system can handle users who don't have any transactions in the system in the first place. To do this, an new visitor is added using the add_visitor method which their ID is outputed to acknowledge that the insertion is successfully done. 
exec add_visitor('Suhan Roy', 'suhan.roy@gmail.com', '383 Wilkens Ave', 'MD', '21250'); 
select * from visitor where visitor_name = 'Suhan Roy';
exec list_visitor_transactions('Suhan Roy');

-- special case : no such visitor is present in the system where if the user were to enter an random person's name such as Sally,it will activate the exception placed in the procedural code which will output 'No such visitor' and stop.
exec list_visitor_transactions('Sally Sanfield'); 

-- 3 test cases (2 normal + 1 special)
 --------------------------------------------------------------------------
-- Feature 3 - Test Case 1 (Normal): Park 'Shenandoah National Park'
-- --------------------------------------------------------------------------
-- park_id 101 has tour facility 7 ('Shenandoah Tour',
-- tour_duration_minutes = 180).
--

EXEC list_park_tours('Shenandoah National Park');
-- Expected Output:
--   Tour Name                               Duration (minutes)
--   ---------------------------------------- ------------------
--   Shenandoah Tour                         180

-- --------------------------------------------------------------------------
-- Feature 3 - Test Case 2 (Normal): Park 'Great Falls Park'
-- --------------------------------------------------------------------------
-- park_id 102 has tour facility 8 ('Great Falls Tour',
-- tour_duration_minutes = 90).
--

EXEC list_park_tours('Great Falls Park');
-- Expected Output:
--   Tour Name                               Duration (minutes)
--   ---------------------------------------- ------------------
--   Great Falls Tour                        90
-- --------------------------------------------------------------------------
-- Feature 3 - Test Case 3 (Special): Non-existent park
-- --------------------------------------------------------------------------
-- 'Sanjay Gandhi Park' is not in the park table.
--

EXEC list_park_tours('Sanjay Gandhi Park');
-- Expected Output:
-- No such park

-- --------------------------------------------------------------------------
-- Feature 4 - Test Case 1 (Normal): Both slots qualify (spots needed = 5)
-- --------------------------------------------------------------------------
-- 'Patapsco Valley Wildlife Tour' is facility_id = 6.
-- tour_detail on 2026-04-01:
--   09:00 available_spots = 15  (15 >= 5 -> include)
--   13:00 available_spots = 10  (10 >= 5 -> include)
--

EXEC list_available_tours('Patapsco Valley Wildlife Tour', TO_DATE('2026-04-01','YYYY-MM-DD'), 5);
-- Expected Output:
--   Start Time              Available Spots
--   ------------------------- ---------------
--   2026-04-01 09:00:00     15
--   2026-04-01 13:00:00     10

-- --------------------------------------------------------------------------
-- Feature 4 - Test Case 2 (Normal): Only 09:00 qualifies (spots needed = 12)
-- --------------------------------------------------------------------------
-- 09:00 available_spots = 15 (15 >= 12 -> include)
-- 13:00 available_spots = 10 (10 <  12 -> exclude)
--

EXEC list_available_tours('Patapsco Valley Wildlife Tour', TO_DATE('2026-04-01','YYYY-MM-DD'), 12);
-- Expected Output:
--   Start Time              Available Spots
--   ------------------------- ---------------
--   2026-04-01 09:00:00     15


-- --------------------------------------------------------------------------
-- Feature 4 - Test Case 3 (Special): Tour does not exist
-- --------------------------------------------------------------------------
-- No facility named 'Fantasy Tour' with facility_type = 3.
--
EXEC list_available_tours('Fantasy Tour',TO_DATE('2026-04-01','YYYY-MM-DD'), 1);
-- Expected Output:
--   No such a tour


-- --------------------------------------------------------------------------
-- Feature 4 - Test Case 4 (Special): No slot has enough spots (needed = 18)
-- --------------------------------------------------------------------------
-- 09:00 = 15 (15 < 18), 13:00 = 10 (10 < 18). Neither qualifies.
--

EXEC list_available_tours('Patapsco Valley Wildlife Tour',TO_DATE('2026-04-01','YYYY-MM-DD'), 18);
-- Expected Output:
--   Start Time              Available Spots
--   ------------------------- ---------------
--   No tour has enough spots

-- --------------------------------------------------------------------------
-- Feature 4 - Test Case 5 (Special): Tour exists but no sessions on date
-- --------------------------------------------------------------------------
-- 'Shenandoah Tour' (facility_id = 7) has tour_detail rows only on
-- 2026-04-02 and 2026-04-04, not on 2026-05-01.
--

EXEC list_available_tours('Shenandoah Tour',TO_DATE('2026-05-01','YYYY-MM-DD'), 1);
-- Expected Output:
--   Start Time              Available Spots
--   ------------------------- ---------------
--   No tour has enough spots


set serveroutput on;
--------------------------------------------------
-- Test Case 1:
-- Existing park with parking lot status = OPEN
--------------------------------------------------

-- Verify actual database records
SELECT p.park_name,
       f.facility_name,
       pl.status
FROM park p
JOIN facility f
     ON p.park_id = f.park_id
JOIN parking_lot pl
     ON f.facility_id = pl.facility_id
WHERE p.park_name = 'Patapsco Valley State Park'
  AND f.facility_type = 4;

-- Expected Output:
-- Displays parking lot names with status = open

EXEC list_parking_lots('Patapsco Valley State Park');

-- Expected Output:
-- Parking Lot Name | Status
-- North Parking Lot | open
-- Visitor Parking | open


--------------------------------------------------
-- Test Case 2:
-- Existing park with parking lot status = LIMITED
--------------------------------------------------

-- Verify actual database records
SELECT p.park_name,
       f.facility_name,
       pl.status
FROM park p
JOIN facility f
     ON p.park_id = f.park_id
JOIN parking_lot pl
     ON f.facility_id = pl.facility_id
WHERE p.park_name = 'Great Falls Park'
  AND f.facility_type = 4;

-- Expected Output:
-- Displays parking lot names with status = limited

EXEC list_parking_lots('Great Falls Park');

-- Expected Output:
-- Parking Lot Name | Status
-- Main Parking Lot | limited


--------------------------------------------------
-- Test Case 3:
-- Non-existing park
--------------------------------------------------

SELECT *
FROM park
WHERE park_name = 'Nonexistent Park';

-- Expected Output:
-- no rows selected

EXEC list_parking_lots('Nonexistent Park');

-- Expected Output:
-- No such park

SET SERVEROUTPUT ON;

-- =========================================================
-- Test Case 1: Parking lot becomes Open
-- =========================================================
EXEC update_parking_status(19, 20);

-- Expected Output:
-- The parking lot is open


-- =========================================================
-- Test Case 2: Parking lot becomes Limited
-- =========================================================
EXEC update_parking_status(18, 46);

-- Expected Output:
-- The parking lot becomes limited


-- =========================================================
-- Test Case 3: Parking lot becomes Full
-- =========================================================
EXEC update_parking_status(10, 80);

-- Expected Output:
-- The parking lot becomes full


-- =========================================================
-- Test Case 4: Invalid facility ID
-- =========================================================
EXEC update_parking_status(999, 50);

-- Expected Output:
-- Invalid facility ID
-- Demo Script for statistics_report

SET SERVEROUTPUT ON;

--------------------------------------------------
-- View Existing Transaction Records
--------------------------------------------------

SELECT transaction_id,
       transaction_type,
       facility_id,
       TO_CHAR(start_time, 'YYYY-MM-DD HH24:MI:SS') AS start_time,
       num_adults,
       num_children,
       total_price,
       status
FROM transaction
ORDER BY transaction_id;

-- Expected Output:
-- Existing transaction records should be displayed.
-- Transactions with status <> 3 are counted in the statistics report.

--------------------------------------------------
-- Execute May Statistics Report (Normal Case)
--------------------------------------------------

BEGIN
    statistics_report(
        DATE '2026-05-01',
        DATE '2026-05-31'
    );
END;
/

-- Expected Output:
-- May 2026 statistics are displayed.
-- Patapsco Valley State Park shows 4 uncanceled transactions,
-- total price 480, total visitors 3,
-- Patapsco Valley Campground A as campsite result,
-- and Patapsco Valley Wildlife Tour as tour result.
-- Shenandoah National Park shows 1 uncanceled transaction
-- and total price 135.
-- Remaining parks show 0 values and None results.

--------------------------------------------------
-- Execute April Statistics Report (Normal Case)
--------------------------------------------------

BEGIN
    statistics_report(
        DATE '2026-04-01',
        DATE '2026-04-30'
    );
END;
/

-- Expected Output:
-- April 2026 statistics are displayed.
-- Patapsco Valley State Park shows 1 uncanceled transaction,
-- total price 195, total visitors 0,
-- campsite result None,
-- and Patapsco Valley Wildlife Tour as tour result.
-- Remaining parks show 0 values and None results.

--------------------------------------------------
-- Execute Statistics Report with No Transactions
-- Special Case
--------------------------------------------------

BEGIN
    statistics_report(
        DATE '2027-01-01',
        DATE '2027-01-05'
    );
END;
/

-- Expected Output:
-- No transactions exist in this date range.
-- For all parks:
-- Total Uncanceled Transactions: 0
-- Total Price: 0
-- Total Visitors: 0
-- Campsite Reservation Result: None
-- Tour Reservation Result: None

set serveroutput on;
--Test cases for demonstration
--Normal case : shows availability of campsites in Centennial Park for an capacity of five members between July 1 & 5. Since there are vacant campsites between these dates and no other overlaps are present, it should show that campsite D has availability to fit for a max of 6 people which is sufficient enough for the user's request.
exec list_available_campsites('Centennial Park', '2026-07-01', '2026-07-05',5);
--Special case : New park entry that doesn't exist in our system where since the park 'Brookside' isn't present in the park table insertions, it will output 'No such park' and stop.
exec list_available_campsites('Brookside', '2026-06-01', '2026-06-05',4); 

-- Special case : Connecting to normal case, but having high capacity num of 100 where since the max for Centennial Park is 6 members only, the script output will show 'No matches found' and stop as the capacity is over the limits that Centennial Park could fit in.
exec list_available_campsites('Centennial Park', '2026-08-01', '2026-08-05',100); 

--Special case : conflicting reservations where the transaction type and status type might not correlate on the user???s request which could create an duration overlap
-- Insert reservation conflict using sequence and creating a brand new conflict at September 4th to prove this case
INSERT INTO transaction (
    transaction_id,
    visitor_id,
    transaction_type,
    facility_id,
    start_time,
    number_of_days,
    num_adults,
    num_children,
  total_price,
    status
)
VALUES (
    transaction_seq.NEXTVAL,
    101,
    2,
    5,
    TO_TIMESTAMP(
        '2026-09-04 10:00:00',
        'YYYY-MM-DD HH24:MI:SS'
    ),
    3,
    2,
    1,
    165,
    1
);

exec list_available_campsites('Great Falls Park', '2026-09-04', '2026-09-06', 3);
-- When this is executed, it will output "No matches" only as there is an conflicting reservation happening in the same date of September 4th that we placed before which will restrict the user from booking an campsite at Great Falls Park

------------------------------------------------------------------------
 ---FEATURE 9 DEMO : reserve_campsite
 ---6 test cases (2 normal + 4 special)
--------------------------------------------------------------------------------

-- --------------------------------------------------------------------------
-- Feature 9 - Test Case 1 (Normal): Successful reservation
-- --------------------------------------------------------------------------
-- Facility 14 = 'Centennial Campground D' (max_people=6, daily_price=$40)
-- Visitor  100 = Alice Smith (exists)
-- People = 2 + 1 = 3 <= 6 -> capacity OK
-- No existing campsite reservation on facility 14 -> no conflict
-- Total price = 2 days * $40 = $80

EXEC reserve_campsite(14, 100, TO_DATE('2026-06-01','YYYY-MM-DD'), 2, 2, 1);

-- Expected Output:
--   Reservation successful! Total price: $80
--
-- Expected DB changes:
--   transaction : new row, type=2, facility_id=14, visitor_id=100,
--                 start_time = 2026-06-01 15:00:00, number_of_days=2,
--                 num_adults=2, num_children=1, total_price=80, status=1
--   message     : new row for visitor 100 with body
--                 'Thanks for reserving campsite Centennial Campground D
--                  from 2026-06-01 for 2 days'

-- Verify the new transaction row
SELECT transaction_id, visitor_id, transaction_type, facility_id,
       TO_CHAR(start_time,'YYYY-MM-DD HH24:MI:SS') AS start_time,
       number_of_days, num_adults, num_children, total_price, status
FROM   transaction
WHERE  facility_id = 14 AND visitor_id = 100;

-- Verify the new message row
SELECT * FROM (
    SELECT visitor_id,
           TO_CHAR(message_time,'YYYY-MM-DD HH24:MI:SS') AS message_time,
           message_body
    FROM   message
    WHERE  visitor_id = 100
    ORDER  BY message_id DESC
)
WHERE ROWNUM = 1;

-- --------------------------------------------------------------------------
-- Feature 9 - Test Case 2 (Special): No such campsite
-- --------------------------------------------------------------------------
-- No row in campsite with facility_id = 999.
--

EXEC reserve_campsite(999, 100, TO_DATE('2026-06-01','YYYY-MM-DD'), 2, 2, 1);
-- Expected Output:
--   No such campsite
-- --------------------------------------------------------------------------
-- Feature 9 - Test Case 3 (Special): No such visitor
-- --------------------------------------------------------------------------
-- Facility 14 exists but visitor_id = 999 does not.
--

EXEC reserve_campsite(14, 999, TO_DATE('2026-06-01','YYYY-MM-DD'), 2, 2, 1);
-- Expected Output:
--   No such visitor
-- --------------------------------------------------------------------------
-- Feature 9 - Test Case 4 (Special): Insufficient capacity
-- --------------------------------------------------------------------------
-- Facility 5 = 'Great Falls Campground C' has max_people = 4.
-- People requested = 3 + 2 = 5 > 4.
--

EXEC reserve_campsite(5, 100, TO_DATE('2026-06-01','YYYY-MM-DD'), 2, 3, 2);
-- Expected Output:
--   Insufficient capacity
-- --------------------------------------------------------------------------
-- Feature 9 - Test Case 5 (Special): Conflicting reservation
-- --------------------------------------------------------------------------
-- Facility 3 = 'Patapsco Valley Campground A' (max_people=6, $50)
-- Visitor  102 = Steve Seylin (exists)
-- People = 2 + 0 = 2 <= 6 -> capacity OK
-- Transaction 2 (already in DB): facility_id=3, type=2, status=1,
--   start_time = SYSDATE  (today, 2026-05-18)
--   number_of_days = 2    (covers TRUNC(SYSDATE) .. TRUNC(SYSDATE)+2)
-- Overlap with input (TRUNC(SYSDATE), 1 day):
--   TRUNC(SYSDATE)            < TRUNC(SYSDATE) + 1   -> TRUE
--   TRUNC(SYSDATE)            < TRUNC(SYSDATE) + 2   -> TRUE   => CONFLICT
--

EXEC reserve_campsite(3, 102, TRUNC(SYSDATE), 1, 2, 0);
-- Expected Output:
--   The campsite is not available due to a conflict
-- --------------------------------------------------------------------------
-- Feature 9 - Test Case 6 (Normal): Reservation on a future date, no conflict
-- --------------------------------------------------------------------------
-- Facility 4 = 'Shenandoah Campground B' (max_people=8, daily_price=$45)
-- Visitor  101 = Jeff Benson (exists)
-- People = 3 + 1 = 4 <= 8 -> capacity OK
-- Transaction 5 already exists on facility 4 (SYSDATE, 3 days =
-- 2026-05-18 .. 2026-05-21), which does NOT overlap with 2026-07-01..07-04.
-- Total price = 3 days * $45 = $135
--

EXEC reserve_campsite(4, 101, TO_DATE('2026-07-01','YYYY-MM-DD'), 3, 3, 1);
-- Expected Output:
--   Reservation successful! Total price: $135
--
-- Expected DB changes:
--   transaction : new row, type=2, facility_id=4, visitor_id=101,
--                 start_time = 2026-07-01 15:00:00, number_of_days=3,
--                 num_adults=3, num_children=1, total_price=135, status=1
--   message     : new row for visitor 101 with body
--                 'Thanks for reserving campsite Shenandoah Campground B
--                  from 2026-07-01 for 3 days'
-- Verify the new transaction row
SELECT *
FROM (
    SELECT transaction_id, visitor_id, transaction_type, facility_id,
           TO_CHAR(start_time,'YYYY-MM-DD HH24:MI:SS') AS start_time,
           number_of_days, num_adults, num_children, total_price, status
    FROM   transaction
    WHERE  facility_id = 4 AND visitor_id = 101
    ORDER  BY transaction_id DESC
)
WHERE ROWNUM = 1;

-- Verify the new message row
SELECT *
FROM (
    SELECT visitor_id,
           TO_CHAR(message_time,'YYYY-MM-DD HH24:MI:SS') AS message_time,
           message_body
    FROM   message
    WHERE  visitor_id = 101
    ORDER  BY message_id DESC
)
WHERE ROWNUM = 1;

----------Demo Script-------------
SET SERVEROUTPUT ON;

--------------------------------------------------
-- BEFORE EXECUTION
--------------------------------------------------

-- Check available spots before reservation
SELECT facility_id,
       TO_CHAR(start_time, 'YYYY-MM-DD HH24:MI:SS') AS start_time,
       available_spots
FROM tour_detail
WHERE facility_id = 6
  AND start_time =
      TIMESTAMP '2026-04-01 09:00:00';

-- Expected Output:
-- Shows current available spots before reservation


--------------------------------------------------
-- Check existing transactions before reservation
--------------------------------------------------
SELECT *
FROM transaction
WHERE facility_id = 6
  AND visitor_id = 100;

-- Expected Output:
-- Existing transaction records (if any)


--------------------------------------------------
-- Check existing messages before reservation
--------------------------------------------------
SELECT *
FROM message
WHERE visitor_id = 100;

-- Expected Output:
-- Existing messages (if any)


--------------------------------------------------
-- SUCCESSFUL RESERVATION
--------------------------------------------------

-- p_facility_id, p_visitor_id, p_start_time,
-- p_num_adults, p_num_children

EXEC reserve_tour(6,100,TIMESTAMP '2026-04-01 09:00:00',2,1);

-- Expected Output:
-- Tour reserved successfully


--------------------------------------------------
-- AFTER EXECUTION
--------------------------------------------------

--------------------------------------------------
-- Verify new transaction row
--------------------------------------------------
SELECT *
FROM (
    SELECT transaction_id,
           visitor_id,
           transaction_type,
           facility_id,
           TO_CHAR(start_time, 'YYYY-MM-DD HH24:MI:SS') AS start_time,
           num_adults,
           num_children,
           total_price,
           status
    FROM transaction
    WHERE facility_id = 6
      AND visitor_id = 100
    ORDER BY transaction_id DESC
)
WHERE ROWNUM = 1;

-- Expected Output:
-- New transaction row inserted
-- total_price calculated successfully


--------------------------------------------------
-- Verify updated available spots
--------------------------------------------------
SELECT facility_id,
       TO_CHAR(start_time, 'YYYY-MM-DD HH24:MI:SS') AS start_time,
       available_spots
FROM tour_detail
WHERE facility_id = 6
  AND start_time =
      TIMESTAMP '2026-04-01 09:00:00';

-- Expected Output:
-- available_spots reduced by 3


--------------------------------------------------
-- Verify confirmation message
--------------------------------------------------
SELECT *
FROM (
    SELECT visitor_id,
           TO_CHAR(message_time, 'YYYY-MM-DD HH24:MI:SS') AS message_time,
           message_body
    FROM message
    WHERE visitor_id = 100
    ORDER BY message_id DESC
)
WHERE ROWNUM = 1;

-- Expected Output:
-- Confirmation message inserted successfully


--------------------------------------------------
-- INVALID TOUR
--------------------------------------------------
EXEC reserve_tour(999,100,TIMESTAMP '2026-04-01 09:00:00',2,1);

-- Expected Output:
-- No such tour


--------------------------------------------------
-- INVALID VISITOR
--------------------------------------------------
EXEC reserve_tour(6, 999, TIMESTAMP '2026-04-01 09:00:00',2,1);

-- Expected Output:
-- No such visitor


--------------------------------------------------
-- NO TOUR AT GIVEN TIME
--------------------------------------------------
EXEC reserve_tour(6,100,TIMESTAMP '2026-04-10 09:00:00', 2, 1);

-- Expected Output:
-- No tour at the given time


--------------------------------------------------
-- INSUFFICIENT CAPACITY
--------------------------------------------------
EXEC reserve_tour(6,100,TIMESTAMP '2026-04-01 13:00:00',8,5);

-- Expected Output:
-- Insufficient capacity




--- DEMO SCRIPT ----

SET SERVEROUTPUT ON;

-- Step 1: Check transaction before cancellation
SELECT transaction_id,
       transaction_type,
       facility_id,
       start_time,
       num_adults,
       num_children,
       status
FROM transaction
WHERE transaction_id = 3;

-- Expected:
-- Transaction 3 exists and status is not 3 before cancellation.

-- Step 2: Run normal case
EXEC cancel_transaction(3);

-- Expected Output:
-- Transaction 3 status updated to canceled
-- Cancellation message inserted successfully

-- Step 3: Check transaction after cancellation
SELECT transaction_id,
       status
FROM transaction
WHERE transaction_id = 3;

-- Expected:
-- Status should be 3.

-- Step 4: Check message table
SELECT *
FROM message
ORDER BY message_id DESC;

-- Expected:
-- A new message should be inserted:
-- 'Your transaction 3 has been canceled'

-- Step 5: Special case - already canceled transaction
EXEC cancel_transaction(3);

-- Expected Output:
-- Transaction already canceled

-- Step 6: Special case - invalid transaction ID
EXEC cancel_transaction(999);

-- Expected Output:
-- Transaction not found

