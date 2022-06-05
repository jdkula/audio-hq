import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  bigint: number;
  float8: unknown;
  jsonb: any;
  numeric: number;
  timestamptz: string;
  uuid: string;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['String']>;
  _gt?: InputMaybe<Scalars['String']>;
  _gte?: InputMaybe<Scalars['String']>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars['String']>;
  _in?: InputMaybe<Array<Scalars['String']>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars['String']>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars['String']>;
  _lt?: InputMaybe<Scalars['String']>;
  _lte?: InputMaybe<Scalars['String']>;
  _neq?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars['String']>;
  _nin?: InputMaybe<Array<Scalars['String']>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars['String']>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars['String']>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars['String']>;
};

/** Boolean expression to compare columns of type "bigint". All fields are combined with logical 'AND'. */
export type Bigint_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['bigint']>;
  _gt?: InputMaybe<Scalars['bigint']>;
  _gte?: InputMaybe<Scalars['bigint']>;
  _in?: InputMaybe<Array<Scalars['bigint']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['bigint']>;
  _lte?: InputMaybe<Scalars['bigint']>;
  _neq?: InputMaybe<Scalars['bigint']>;
  _nin?: InputMaybe<Array<Scalars['bigint']>>;
};

/** one set of tracks playing */
export type Deck = {
  __typename?: 'deck';
  created_at: Scalars['timestamptz'];
  id: Scalars['uuid'];
  pause_timestamp?: Maybe<Scalars['timestamptz']>;
  /** An array relationship */
  queue: Array<Track>;
  speed: Scalars['numeric'];
  start_timestamp: Scalars['timestamptz'];
  type: Deck_Type_Enum_Enum;
  volume: Scalars['numeric'];
  /** An object relationship */
  workspace: Workspace;
  workspace_id: Scalars['uuid'];
};


/** one set of tracks playing */
export type DeckQueueArgs = {
  distinct_on?: InputMaybe<Array<Track_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Track_Order_By>>;
  where?: InputMaybe<Track_Bool_Exp>;
};

/** order by aggregate values of table "deck" */
export type Deck_Aggregate_Order_By = {
  avg?: InputMaybe<Deck_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Deck_Max_Order_By>;
  min?: InputMaybe<Deck_Min_Order_By>;
  stddev?: InputMaybe<Deck_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Deck_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Deck_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Deck_Sum_Order_By>;
  var_pop?: InputMaybe<Deck_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Deck_Var_Samp_Order_By>;
  variance?: InputMaybe<Deck_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "deck" */
export type Deck_Arr_Rel_Insert_Input = {
  data: Array<Deck_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Deck_On_Conflict>;
};

/** order by avg() on columns of table "deck" */
export type Deck_Avg_Order_By = {
  speed?: InputMaybe<Order_By>;
  volume?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "deck". All fields are combined with a logical 'AND'. */
export type Deck_Bool_Exp = {
  _and?: InputMaybe<Array<Deck_Bool_Exp>>;
  _not?: InputMaybe<Deck_Bool_Exp>;
  _or?: InputMaybe<Array<Deck_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  pause_timestamp?: InputMaybe<Timestamptz_Comparison_Exp>;
  queue?: InputMaybe<Track_Bool_Exp>;
  speed?: InputMaybe<Numeric_Comparison_Exp>;
  start_timestamp?: InputMaybe<Timestamptz_Comparison_Exp>;
  type?: InputMaybe<Deck_Type_Enum_Enum_Comparison_Exp>;
  volume?: InputMaybe<Numeric_Comparison_Exp>;
  workspace?: InputMaybe<Workspace_Bool_Exp>;
  workspace_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "deck" */
export enum Deck_Constraint {
  /** unique or primary key constraint */
  DeckPkey = 'deck_pkey'
}

/** input type for incrementing numeric columns in table "deck" */
export type Deck_Inc_Input = {
  speed?: InputMaybe<Scalars['numeric']>;
  volume?: InputMaybe<Scalars['numeric']>;
};

/** input type for inserting data into table "deck" */
export type Deck_Insert_Input = {
  dummy?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  pause_timestamp?: InputMaybe<Scalars['timestamptz']>;
  queue?: InputMaybe<Track_Arr_Rel_Insert_Input>;
  speed?: InputMaybe<Scalars['numeric']>;
  start_timestamp?: InputMaybe<Scalars['timestamptz']>;
  type?: InputMaybe<Deck_Type_Enum_Enum>;
  volume?: InputMaybe<Scalars['numeric']>;
  workspace?: InputMaybe<Workspace_Obj_Rel_Insert_Input>;
  workspace_id?: InputMaybe<Scalars['uuid']>;
};

/** order by max() on columns of table "deck" */
export type Deck_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  pause_timestamp?: InputMaybe<Order_By>;
  speed?: InputMaybe<Order_By>;
  start_timestamp?: InputMaybe<Order_By>;
  volume?: InputMaybe<Order_By>;
  workspace_id?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "deck" */
export type Deck_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  pause_timestamp?: InputMaybe<Order_By>;
  speed?: InputMaybe<Order_By>;
  start_timestamp?: InputMaybe<Order_By>;
  volume?: InputMaybe<Order_By>;
  workspace_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "deck" */
export type Deck_Mutation_Response = {
  __typename?: 'deck_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Deck>;
};

/** input type for inserting object relation for remote table "deck" */
export type Deck_Obj_Rel_Insert_Input = {
  data: Deck_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Deck_On_Conflict>;
};

/** on_conflict condition type for table "deck" */
export type Deck_On_Conflict = {
  constraint: Deck_Constraint;
  update_columns?: Array<Deck_Update_Column>;
  where?: InputMaybe<Deck_Bool_Exp>;
};

/** Ordering options when selecting data from "deck". */
export type Deck_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  pause_timestamp?: InputMaybe<Order_By>;
  queue_aggregate?: InputMaybe<Track_Aggregate_Order_By>;
  speed?: InputMaybe<Order_By>;
  start_timestamp?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
  volume?: InputMaybe<Order_By>;
  workspace?: InputMaybe<Workspace_Order_By>;
  workspace_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: deck */
export type Deck_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "deck" */
export enum Deck_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  PauseTimestamp = 'pause_timestamp',
  /** column name */
  Speed = 'speed',
  /** column name */
  StartTimestamp = 'start_timestamp',
  /** column name */
  Type = 'type',
  /** column name */
  Volume = 'volume',
  /** column name */
  WorkspaceId = 'workspace_id'
}

/** input type for updating data in table "deck" */
export type Deck_Set_Input = {
  dummy?: InputMaybe<Scalars['timestamptz']>;
  pause_timestamp?: InputMaybe<Scalars['timestamptz']>;
  speed?: InputMaybe<Scalars['numeric']>;
  start_timestamp?: InputMaybe<Scalars['timestamptz']>;
  volume?: InputMaybe<Scalars['numeric']>;
};

/** order by stddev() on columns of table "deck" */
export type Deck_Stddev_Order_By = {
  speed?: InputMaybe<Order_By>;
  volume?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "deck" */
export type Deck_Stddev_Pop_Order_By = {
  speed?: InputMaybe<Order_By>;
  volume?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "deck" */
export type Deck_Stddev_Samp_Order_By = {
  speed?: InputMaybe<Order_By>;
  volume?: InputMaybe<Order_By>;
};

/** order by sum() on columns of table "deck" */
export type Deck_Sum_Order_By = {
  speed?: InputMaybe<Order_By>;
  volume?: InputMaybe<Order_By>;
};

export enum Deck_Type_Enum_Enum {
  /** any ambience */
  Ambience = 'ambience',
  /** the main player */
  Main = 'main',
  /** any ambience */
  Sfx = 'sfx'
}

/** Boolean expression to compare columns of type "deck_type_enum_enum". All fields are combined with logical 'AND'. */
export type Deck_Type_Enum_Enum_Comparison_Exp = {
  _eq?: InputMaybe<Deck_Type_Enum_Enum>;
  _in?: InputMaybe<Array<Deck_Type_Enum_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _neq?: InputMaybe<Deck_Type_Enum_Enum>;
  _nin?: InputMaybe<Array<Deck_Type_Enum_Enum>>;
};

/** update columns of table "deck" */
export enum Deck_Update_Column {
  /** column name */
  Dummy = 'dummy',
  /** column name */
  PauseTimestamp = 'pause_timestamp',
  /** column name */
  Speed = 'speed',
  /** column name */
  StartTimestamp = 'start_timestamp',
  /** column name */
  Volume = 'volume'
}

/** order by var_pop() on columns of table "deck" */
export type Deck_Var_Pop_Order_By = {
  speed?: InputMaybe<Order_By>;
  volume?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "deck" */
export type Deck_Var_Samp_Order_By = {
  speed?: InputMaybe<Order_By>;
  volume?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "deck" */
export type Deck_Variance_Order_By = {
  speed?: InputMaybe<Order_By>;
  volume?: InputMaybe<Order_By>;
};

/** input type for inserting data into table "delete_job" */
export type Delete_Job_Insert_Input = {
  file_id?: InputMaybe<Scalars['uuid']>;
};

/** response of any mutation on the table "delete_job" */
export type Delete_Job_Mutation_Response = {
  __typename?: 'delete_job_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
};

/** columns and relationships of "event" */
export type Event = {
  __typename?: 'event';
  /** An object relationship */
  deck?: Maybe<Deck>;
  deck_id?: Maybe<Scalars['uuid']>;
  event_type: Scalars['String'];
  /** An object relationship */
  file?: Maybe<File>;
  file_id?: Maybe<Scalars['uuid']>;
  id: Scalars['uuid'];
  modification_type: Scalars['String'];
  time: Scalars['timestamptz'];
  /** An object relationship */
  track?: Maybe<Track>;
  track_id?: Maybe<Scalars['uuid']>;
  /** An object relationship */
  workspace?: Maybe<Workspace>;
  workspace_id?: Maybe<Scalars['uuid']>;
};

/** aggregated selection of "event" */
export type Event_Aggregate = {
  __typename?: 'event_aggregate';
  aggregate?: Maybe<Event_Aggregate_Fields>;
  nodes: Array<Event>;
};

/** aggregate fields of "event" */
export type Event_Aggregate_Fields = {
  __typename?: 'event_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Event_Max_Fields>;
  min?: Maybe<Event_Min_Fields>;
};


/** aggregate fields of "event" */
export type Event_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Event_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "event". All fields are combined with a logical 'AND'. */
export type Event_Bool_Exp = {
  _and?: InputMaybe<Array<Event_Bool_Exp>>;
  _not?: InputMaybe<Event_Bool_Exp>;
  _or?: InputMaybe<Array<Event_Bool_Exp>>;
  deck?: InputMaybe<Deck_Bool_Exp>;
  deck_id?: InputMaybe<Uuid_Comparison_Exp>;
  event_type?: InputMaybe<String_Comparison_Exp>;
  file?: InputMaybe<File_Bool_Exp>;
  file_id?: InputMaybe<Uuid_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  modification_type?: InputMaybe<String_Comparison_Exp>;
  time?: InputMaybe<Timestamptz_Comparison_Exp>;
  track?: InputMaybe<Track_Bool_Exp>;
  track_id?: InputMaybe<Uuid_Comparison_Exp>;
  workspace?: InputMaybe<Workspace_Bool_Exp>;
  workspace_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** aggregate max on columns */
export type Event_Max_Fields = {
  __typename?: 'event_max_fields';
  deck_id?: Maybe<Scalars['uuid']>;
  event_type?: Maybe<Scalars['String']>;
  file_id?: Maybe<Scalars['uuid']>;
  id?: Maybe<Scalars['uuid']>;
  modification_type?: Maybe<Scalars['String']>;
  time?: Maybe<Scalars['timestamptz']>;
  track_id?: Maybe<Scalars['uuid']>;
  workspace_id?: Maybe<Scalars['uuid']>;
};

/** aggregate min on columns */
export type Event_Min_Fields = {
  __typename?: 'event_min_fields';
  deck_id?: Maybe<Scalars['uuid']>;
  event_type?: Maybe<Scalars['String']>;
  file_id?: Maybe<Scalars['uuid']>;
  id?: Maybe<Scalars['uuid']>;
  modification_type?: Maybe<Scalars['String']>;
  time?: Maybe<Scalars['timestamptz']>;
  track_id?: Maybe<Scalars['uuid']>;
  workspace_id?: Maybe<Scalars['uuid']>;
};

/** Ordering options when selecting data from "event". */
export type Event_Order_By = {
  deck?: InputMaybe<Deck_Order_By>;
  deck_id?: InputMaybe<Order_By>;
  event_type?: InputMaybe<Order_By>;
  file?: InputMaybe<File_Order_By>;
  file_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  modification_type?: InputMaybe<Order_By>;
  time?: InputMaybe<Order_By>;
  track?: InputMaybe<Track_Order_By>;
  track_id?: InputMaybe<Order_By>;
  workspace?: InputMaybe<Workspace_Order_By>;
  workspace_id?: InputMaybe<Order_By>;
};

/** select columns of table "event" */
export enum Event_Select_Column {
  /** column name */
  DeckId = 'deck_id',
  /** column name */
  EventType = 'event_type',
  /** column name */
  FileId = 'file_id',
  /** column name */
  Id = 'id',
  /** column name */
  ModificationType = 'modification_type',
  /** column name */
  Time = 'time',
  /** column name */
  TrackId = 'track_id',
  /** column name */
  WorkspaceId = 'workspace_id'
}

/** columns and relationships of "file" */
export type File = {
  __typename?: 'file';
  description: Scalars['String'];
  download_url: Scalars['String'];
  id: Scalars['uuid'];
  length: Scalars['numeric'];
  name: Scalars['String'];
  ordering?: Maybe<Scalars['bigint']>;
  path: Scalars['jsonb'];
  type: File_Type_Enum_Enum;
  /** An object relationship */
  workspace: Workspace;
  workspace_id: Scalars['uuid'];
};


/** columns and relationships of "file" */
export type FilePathArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** order by aggregate values of table "file" */
export type File_Aggregate_Order_By = {
  avg?: InputMaybe<File_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<File_Max_Order_By>;
  min?: InputMaybe<File_Min_Order_By>;
  stddev?: InputMaybe<File_Stddev_Order_By>;
  stddev_pop?: InputMaybe<File_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<File_Stddev_Samp_Order_By>;
  sum?: InputMaybe<File_Sum_Order_By>;
  var_pop?: InputMaybe<File_Var_Pop_Order_By>;
  var_samp?: InputMaybe<File_Var_Samp_Order_By>;
  variance?: InputMaybe<File_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type File_Append_Input = {
  path?: InputMaybe<Scalars['jsonb']>;
};

/** order by avg() on columns of table "file" */
export type File_Avg_Order_By = {
  length?: InputMaybe<Order_By>;
  ordering?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "file". All fields are combined with a logical 'AND'. */
export type File_Bool_Exp = {
  _and?: InputMaybe<Array<File_Bool_Exp>>;
  _not?: InputMaybe<File_Bool_Exp>;
  _or?: InputMaybe<Array<File_Bool_Exp>>;
  description?: InputMaybe<String_Comparison_Exp>;
  download_url?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  length?: InputMaybe<Numeric_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  ordering?: InputMaybe<Bigint_Comparison_Exp>;
  path?: InputMaybe<Jsonb_Comparison_Exp>;
  type?: InputMaybe<File_Type_Enum_Enum_Comparison_Exp>;
  workspace?: InputMaybe<Workspace_Bool_Exp>;
  workspace_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type File_Delete_At_Path_Input = {
  path?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type File_Delete_Elem_Input = {
  path?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type File_Delete_Key_Input = {
  path?: InputMaybe<Scalars['String']>;
};

/** input type for incrementing numeric columns in table "file" */
export type File_Inc_Input = {
  ordering?: InputMaybe<Scalars['bigint']>;
};

/** order by max() on columns of table "file" */
export type File_Max_Order_By = {
  description?: InputMaybe<Order_By>;
  download_url?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  length?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  ordering?: InputMaybe<Order_By>;
  workspace_id?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "file" */
export type File_Min_Order_By = {
  description?: InputMaybe<Order_By>;
  download_url?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  length?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  ordering?: InputMaybe<Order_By>;
  workspace_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "file" */
export type File_Mutation_Response = {
  __typename?: 'file_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<File>;
};

/** Ordering options when selecting data from "file". */
export type File_Order_By = {
  description?: InputMaybe<Order_By>;
  download_url?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  length?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  ordering?: InputMaybe<Order_By>;
  path?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
  workspace?: InputMaybe<Workspace_Order_By>;
  workspace_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: file */
export type File_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type File_Prepend_Input = {
  path?: InputMaybe<Scalars['jsonb']>;
};

/** select columns of table "file" */
export enum File_Select_Column {
  /** column name */
  Description = 'description',
  /** column name */
  DownloadUrl = 'download_url',
  /** column name */
  Id = 'id',
  /** column name */
  Length = 'length',
  /** column name */
  Name = 'name',
  /** column name */
  Ordering = 'ordering',
  /** column name */
  Path = 'path',
  /** column name */
  Type = 'type',
  /** column name */
  WorkspaceId = 'workspace_id'
}

/** input type for updating data in table "file" */
export type File_Set_Input = {
  description?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  ordering?: InputMaybe<Scalars['bigint']>;
  path?: InputMaybe<Scalars['jsonb']>;
};

/** order by stddev() on columns of table "file" */
export type File_Stddev_Order_By = {
  length?: InputMaybe<Order_By>;
  ordering?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "file" */
export type File_Stddev_Pop_Order_By = {
  length?: InputMaybe<Order_By>;
  ordering?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "file" */
export type File_Stddev_Samp_Order_By = {
  length?: InputMaybe<Order_By>;
  ordering?: InputMaybe<Order_By>;
};

/** order by sum() on columns of table "file" */
export type File_Sum_Order_By = {
  length?: InputMaybe<Order_By>;
  ordering?: InputMaybe<Order_By>;
};

export enum File_Type_Enum_Enum {
  /** a single audio file */
  Audio = 'audio',
  /** a set of audio files */
  Audioset = 'audioset'
}

/** Boolean expression to compare columns of type "file_type_enum_enum". All fields are combined with logical 'AND'. */
export type File_Type_Enum_Enum_Comparison_Exp = {
  _eq?: InputMaybe<File_Type_Enum_Enum>;
  _in?: InputMaybe<Array<File_Type_Enum_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _neq?: InputMaybe<File_Type_Enum_Enum>;
  _nin?: InputMaybe<Array<File_Type_Enum_Enum>>;
};

/** columns and relationships of "file_upload" */
export type File_Upload = {
  __typename?: 'file_upload';
  id: Scalars['uuid'];
};

/** Boolean expression to filter rows from the table "file_upload". All fields are combined with a logical 'AND'. */
export type File_Upload_Bool_Exp = {
  _and?: InputMaybe<Array<File_Upload_Bool_Exp>>;
  _not?: InputMaybe<File_Upload_Bool_Exp>;
  _or?: InputMaybe<Array<File_Upload_Bool_Exp>>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** input type for inserting data into table "file_upload" */
export type File_Upload_Insert_Input = {
  base64?: InputMaybe<Scalars['String']>;
};

/** response of any mutation on the table "file_upload" */
export type File_Upload_Mutation_Response = {
  __typename?: 'file_upload_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<File_Upload>;
};

/** input type for inserting object relation for remote table "file_upload" */
export type File_Upload_Obj_Rel_Insert_Input = {
  data: File_Upload_Insert_Input;
};

/** Ordering options when selecting data from "file_upload". */
export type File_Upload_Order_By = {
  id?: InputMaybe<Order_By>;
};

/** select columns of table "file_upload" */
export enum File_Upload_Select_Column {
  /** column name */
  Id = 'id'
}

/** order by var_pop() on columns of table "file" */
export type File_Var_Pop_Order_By = {
  length?: InputMaybe<Order_By>;
  ordering?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "file" */
export type File_Var_Samp_Order_By = {
  length?: InputMaybe<Order_By>;
  ordering?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "file" */
export type File_Variance_Order_By = {
  length?: InputMaybe<Order_By>;
  ordering?: InputMaybe<Order_By>;
};

/** Boolean expression to compare columns of type "float8". All fields are combined with logical 'AND'. */
export type Float8_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['float8']>;
  _gt?: InputMaybe<Scalars['float8']>;
  _gte?: InputMaybe<Scalars['float8']>;
  _in?: InputMaybe<Array<Scalars['float8']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['float8']>;
  _lte?: InputMaybe<Scalars['float8']>;
  _neq?: InputMaybe<Scalars['float8']>;
  _nin?: InputMaybe<Array<Scalars['float8']>>;
};

/** columns and relationships of "job" */
export type Job = {
  __typename?: 'job';
  assign_time?: Maybe<Scalars['timestamptz']>;
  assigned_worker?: Maybe<Scalars['uuid']>;
  created_at: Scalars['timestamptz'];
  description: Scalars['String'];
  error?: Maybe<Scalars['String']>;
  /** An object relationship */
  file_upload?: Maybe<File_Upload>;
  file_upload_id?: Maybe<Scalars['uuid']>;
  id: Scalars['uuid'];
  name: Scalars['String'];
  option_cut_end?: Maybe<Scalars['float8']>;
  option_cut_start?: Maybe<Scalars['float8']>;
  option_fade_in?: Maybe<Scalars['float8']>;
  option_fade_out?: Maybe<Scalars['float8']>;
  path: Scalars['jsonb'];
  progress?: Maybe<Scalars['numeric']>;
  status: Job_Status_Enum_Enum;
  url?: Maybe<Scalars['String']>;
  workspace_id: Scalars['uuid'];
};


/** columns and relationships of "job" */
export type JobPathArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** order by aggregate values of table "job" */
export type Job_Aggregate_Order_By = {
  avg?: InputMaybe<Job_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Job_Max_Order_By>;
  min?: InputMaybe<Job_Min_Order_By>;
  stddev?: InputMaybe<Job_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Job_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Job_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Job_Sum_Order_By>;
  var_pop?: InputMaybe<Job_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Job_Var_Samp_Order_By>;
  variance?: InputMaybe<Job_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "job" */
export type Job_Arr_Rel_Insert_Input = {
  data: Array<Job_Insert_Input>;
};

/** order by avg() on columns of table "job" */
export type Job_Avg_Order_By = {
  option_cut_end?: InputMaybe<Order_By>;
  option_cut_start?: InputMaybe<Order_By>;
  option_fade_in?: InputMaybe<Order_By>;
  option_fade_out?: InputMaybe<Order_By>;
  progress?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "job". All fields are combined with a logical 'AND'. */
export type Job_Bool_Exp = {
  _and?: InputMaybe<Array<Job_Bool_Exp>>;
  _not?: InputMaybe<Job_Bool_Exp>;
  _or?: InputMaybe<Array<Job_Bool_Exp>>;
  assign_time?: InputMaybe<Timestamptz_Comparison_Exp>;
  assigned_worker?: InputMaybe<Uuid_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  error?: InputMaybe<String_Comparison_Exp>;
  file_upload?: InputMaybe<File_Upload_Bool_Exp>;
  file_upload_id?: InputMaybe<Uuid_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  option_cut_end?: InputMaybe<Float8_Comparison_Exp>;
  option_cut_start?: InputMaybe<Float8_Comparison_Exp>;
  option_fade_in?: InputMaybe<Float8_Comparison_Exp>;
  option_fade_out?: InputMaybe<Float8_Comparison_Exp>;
  path?: InputMaybe<Jsonb_Comparison_Exp>;
  progress?: InputMaybe<Numeric_Comparison_Exp>;
  status?: InputMaybe<Job_Status_Enum_Enum_Comparison_Exp>;
  url?: InputMaybe<String_Comparison_Exp>;
  workspace_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** input type for inserting data into table "job" */
export type Job_Insert_Input = {
  description?: InputMaybe<Scalars['String']>;
  file_upload?: InputMaybe<File_Upload_Obj_Rel_Insert_Input>;
  file_upload_id?: InputMaybe<Scalars['uuid']>;
  name?: InputMaybe<Scalars['String']>;
  option_cut_end?: InputMaybe<Scalars['float8']>;
  option_cut_start?: InputMaybe<Scalars['float8']>;
  option_fade_in?: InputMaybe<Scalars['float8']>;
  option_fade_out?: InputMaybe<Scalars['float8']>;
  path?: InputMaybe<Scalars['jsonb']>;
  url?: InputMaybe<Scalars['String']>;
  workspace_id?: InputMaybe<Scalars['uuid']>;
};

/** order by max() on columns of table "job" */
export type Job_Max_Order_By = {
  assign_time?: InputMaybe<Order_By>;
  assigned_worker?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  error?: InputMaybe<Order_By>;
  file_upload_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  option_cut_end?: InputMaybe<Order_By>;
  option_cut_start?: InputMaybe<Order_By>;
  option_fade_in?: InputMaybe<Order_By>;
  option_fade_out?: InputMaybe<Order_By>;
  progress?: InputMaybe<Order_By>;
  url?: InputMaybe<Order_By>;
  workspace_id?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "job" */
export type Job_Min_Order_By = {
  assign_time?: InputMaybe<Order_By>;
  assigned_worker?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  error?: InputMaybe<Order_By>;
  file_upload_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  option_cut_end?: InputMaybe<Order_By>;
  option_cut_start?: InputMaybe<Order_By>;
  option_fade_in?: InputMaybe<Order_By>;
  option_fade_out?: InputMaybe<Order_By>;
  progress?: InputMaybe<Order_By>;
  url?: InputMaybe<Order_By>;
  workspace_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "job" */
export type Job_Mutation_Response = {
  __typename?: 'job_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Job>;
};

/** Ordering options when selecting data from "job". */
export type Job_Order_By = {
  assign_time?: InputMaybe<Order_By>;
  assigned_worker?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  error?: InputMaybe<Order_By>;
  file_upload?: InputMaybe<File_Upload_Order_By>;
  file_upload_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  option_cut_end?: InputMaybe<Order_By>;
  option_cut_start?: InputMaybe<Order_By>;
  option_fade_in?: InputMaybe<Order_By>;
  option_fade_out?: InputMaybe<Order_By>;
  path?: InputMaybe<Order_By>;
  progress?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  url?: InputMaybe<Order_By>;
  workspace_id?: InputMaybe<Order_By>;
};

/** select columns of table "job" */
export enum Job_Select_Column {
  /** column name */
  AssignTime = 'assign_time',
  /** column name */
  AssignedWorker = 'assigned_worker',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  Error = 'error',
  /** column name */
  FileUploadId = 'file_upload_id',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  OptionCutEnd = 'option_cut_end',
  /** column name */
  OptionCutStart = 'option_cut_start',
  /** column name */
  OptionFadeIn = 'option_fade_in',
  /** column name */
  OptionFadeOut = 'option_fade_out',
  /** column name */
  Path = 'path',
  /** column name */
  Progress = 'progress',
  /** column name */
  Status = 'status',
  /** column name */
  Url = 'url',
  /** column name */
  WorkspaceId = 'workspace_id'
}

export enum Job_Status_Enum_Enum {
  /** assigned to a worker */
  Assigned = 'assigned',
  /** worker is converting the file */
  Converting = 'converting',
  /** job is done */
  Done = 'done',
  /** worker is downloading the necessary file */
  Downloading = 'downloading',
  /** an error occurred */
  Error = 'error',
  /** worker is saving the file to its final location */
  Saving = 'saving',
  /** file is being uploaded from the client to the worker */
  Uploading = 'uploading',
  /** waiting for a worker */
  Waiting = 'waiting'
}

/** Boolean expression to compare columns of type "job_status_enum_enum". All fields are combined with logical 'AND'. */
export type Job_Status_Enum_Enum_Comparison_Exp = {
  _eq?: InputMaybe<Job_Status_Enum_Enum>;
  _in?: InputMaybe<Array<Job_Status_Enum_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _neq?: InputMaybe<Job_Status_Enum_Enum>;
  _nin?: InputMaybe<Array<Job_Status_Enum_Enum>>;
};

/** order by stddev() on columns of table "job" */
export type Job_Stddev_Order_By = {
  option_cut_end?: InputMaybe<Order_By>;
  option_cut_start?: InputMaybe<Order_By>;
  option_fade_in?: InputMaybe<Order_By>;
  option_fade_out?: InputMaybe<Order_By>;
  progress?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "job" */
export type Job_Stddev_Pop_Order_By = {
  option_cut_end?: InputMaybe<Order_By>;
  option_cut_start?: InputMaybe<Order_By>;
  option_fade_in?: InputMaybe<Order_By>;
  option_fade_out?: InputMaybe<Order_By>;
  progress?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "job" */
export type Job_Stddev_Samp_Order_By = {
  option_cut_end?: InputMaybe<Order_By>;
  option_cut_start?: InputMaybe<Order_By>;
  option_fade_in?: InputMaybe<Order_By>;
  option_fade_out?: InputMaybe<Order_By>;
  progress?: InputMaybe<Order_By>;
};

/** order by sum() on columns of table "job" */
export type Job_Sum_Order_By = {
  option_cut_end?: InputMaybe<Order_By>;
  option_cut_start?: InputMaybe<Order_By>;
  option_fade_in?: InputMaybe<Order_By>;
  option_fade_out?: InputMaybe<Order_By>;
  progress?: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "job" */
export type Job_Var_Pop_Order_By = {
  option_cut_end?: InputMaybe<Order_By>;
  option_cut_start?: InputMaybe<Order_By>;
  option_fade_in?: InputMaybe<Order_By>;
  option_fade_out?: InputMaybe<Order_By>;
  progress?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "job" */
export type Job_Var_Samp_Order_By = {
  option_cut_end?: InputMaybe<Order_By>;
  option_cut_start?: InputMaybe<Order_By>;
  option_fade_in?: InputMaybe<Order_By>;
  option_fade_out?: InputMaybe<Order_By>;
  progress?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "job" */
export type Job_Variance_Order_By = {
  option_cut_end?: InputMaybe<Order_By>;
  option_cut_start?: InputMaybe<Order_By>;
  option_fade_in?: InputMaybe<Order_By>;
  option_fade_out?: InputMaybe<Order_By>;
  progress?: InputMaybe<Order_By>;
};

export type Jsonb_Cast_Exp = {
  String?: InputMaybe<String_Comparison_Exp>;
};

/** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
export type Jsonb_Comparison_Exp = {
  _cast?: InputMaybe<Jsonb_Cast_Exp>;
  /** is the column contained in the given json value */
  _contained_in?: InputMaybe<Scalars['jsonb']>;
  /** does the column contain the given json value at the top level */
  _contains?: InputMaybe<Scalars['jsonb']>;
  _eq?: InputMaybe<Scalars['jsonb']>;
  _gt?: InputMaybe<Scalars['jsonb']>;
  _gte?: InputMaybe<Scalars['jsonb']>;
  /** does the string exist as a top-level key in the column */
  _has_key?: InputMaybe<Scalars['String']>;
  /** do all of these strings exist as top-level keys in the column */
  _has_keys_all?: InputMaybe<Array<Scalars['String']>>;
  /** do any of these strings exist as top-level keys in the column */
  _has_keys_any?: InputMaybe<Array<Scalars['String']>>;
  _in?: InputMaybe<Array<Scalars['jsonb']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['jsonb']>;
  _lte?: InputMaybe<Scalars['jsonb']>;
  _neq?: InputMaybe<Scalars['jsonb']>;
  _nin?: InputMaybe<Array<Scalars['jsonb']>>;
};

/** mutation root */
export type Mutation_Root = {
  __typename?: 'mutation_root';
  /** delete data from the table: "deck" */
  delete_deck?: Maybe<Deck_Mutation_Response>;
  /** delete single row from the table: "deck" */
  delete_deck_by_pk?: Maybe<Deck>;
  /** delete data from the table: "job" */
  delete_job?: Maybe<Job_Mutation_Response>;
  /** delete single row from the table: "job" */
  delete_job_by_pk?: Maybe<Job>;
  /** delete data from the table: "track" */
  delete_track?: Maybe<Track_Mutation_Response>;
  /** delete single row from the table: "track" */
  delete_track_by_pk?: Maybe<Track>;
  /** insert data into the table: "deck" */
  insert_deck?: Maybe<Deck_Mutation_Response>;
  /** insert a single row into the table: "deck" */
  insert_deck_one?: Maybe<Deck>;
  /** insert data into the table: "delete_job" */
  insert_delete_job?: Maybe<Delete_Job_Mutation_Response>;
  /** insert data into the table: "file_upload" */
  insert_file_upload?: Maybe<File_Upload_Mutation_Response>;
  /** insert a single row into the table: "file_upload" */
  insert_file_upload_one?: Maybe<File_Upload>;
  /** insert data into the table: "job" */
  insert_job?: Maybe<Job_Mutation_Response>;
  /** insert a single row into the table: "job" */
  insert_job_one?: Maybe<Job>;
  /** insert data into the table: "track" */
  insert_track?: Maybe<Track_Mutation_Response>;
  /** insert a single row into the table: "track" */
  insert_track_one?: Maybe<Track>;
  /** insert data into the table: "workspace" */
  insert_workspace?: Maybe<Workspace_Mutation_Response>;
  /** insert a single row into the table: "workspace" */
  insert_workspace_one?: Maybe<Workspace>;
  /** update data of the table: "deck" */
  update_deck?: Maybe<Deck_Mutation_Response>;
  /** update single row of the table: "deck" */
  update_deck_by_pk?: Maybe<Deck>;
  /** update data of the table: "file" */
  update_file?: Maybe<File_Mutation_Response>;
  /** update single row of the table: "file" */
  update_file_by_pk?: Maybe<File>;
  /** update data of the table: "workspace" */
  update_workspace?: Maybe<Workspace_Mutation_Response>;
  /** update single row of the table: "workspace" */
  update_workspace_by_pk?: Maybe<Workspace>;
};


/** mutation root */
export type Mutation_RootDelete_DeckArgs = {
  where: Deck_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Deck_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_JobArgs = {
  where: Job_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Job_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_TrackArgs = {
  where: Track_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Track_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootInsert_DeckArgs = {
  objects: Array<Deck_Insert_Input>;
  on_conflict?: InputMaybe<Deck_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Deck_OneArgs = {
  object: Deck_Insert_Input;
  on_conflict?: InputMaybe<Deck_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Delete_JobArgs = {
  objects: Array<Delete_Job_Insert_Input>;
};


/** mutation root */
export type Mutation_RootInsert_File_UploadArgs = {
  objects: Array<File_Upload_Insert_Input>;
};


/** mutation root */
export type Mutation_RootInsert_File_Upload_OneArgs = {
  object: File_Upload_Insert_Input;
};


/** mutation root */
export type Mutation_RootInsert_JobArgs = {
  objects: Array<Job_Insert_Input>;
};


/** mutation root */
export type Mutation_RootInsert_Job_OneArgs = {
  object: Job_Insert_Input;
};


/** mutation root */
export type Mutation_RootInsert_TrackArgs = {
  objects: Array<Track_Insert_Input>;
};


/** mutation root */
export type Mutation_RootInsert_Track_OneArgs = {
  object: Track_Insert_Input;
};


/** mutation root */
export type Mutation_RootInsert_WorkspaceArgs = {
  objects: Array<Workspace_Insert_Input>;
  on_conflict?: InputMaybe<Workspace_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Workspace_OneArgs = {
  object: Workspace_Insert_Input;
  on_conflict?: InputMaybe<Workspace_On_Conflict>;
};


/** mutation root */
export type Mutation_RootUpdate_DeckArgs = {
  _inc?: InputMaybe<Deck_Inc_Input>;
  _set?: InputMaybe<Deck_Set_Input>;
  where: Deck_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Deck_By_PkArgs = {
  _inc?: InputMaybe<Deck_Inc_Input>;
  _set?: InputMaybe<Deck_Set_Input>;
  pk_columns: Deck_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_FileArgs = {
  _append?: InputMaybe<File_Append_Input>;
  _delete_at_path?: InputMaybe<File_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<File_Delete_Elem_Input>;
  _delete_key?: InputMaybe<File_Delete_Key_Input>;
  _inc?: InputMaybe<File_Inc_Input>;
  _prepend?: InputMaybe<File_Prepend_Input>;
  _set?: InputMaybe<File_Set_Input>;
  where: File_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_File_By_PkArgs = {
  _append?: InputMaybe<File_Append_Input>;
  _delete_at_path?: InputMaybe<File_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<File_Delete_Elem_Input>;
  _delete_key?: InputMaybe<File_Delete_Key_Input>;
  _inc?: InputMaybe<File_Inc_Input>;
  _prepend?: InputMaybe<File_Prepend_Input>;
  _set?: InputMaybe<File_Set_Input>;
  pk_columns: File_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_WorkspaceArgs = {
  _set?: InputMaybe<Workspace_Set_Input>;
  where: Workspace_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Workspace_By_PkArgs = {
  _set?: InputMaybe<Workspace_Set_Input>;
  pk_columns: Workspace_Pk_Columns_Input;
};

/** Boolean expression to compare columns of type "numeric". All fields are combined with logical 'AND'. */
export type Numeric_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['numeric']>;
  _gt?: InputMaybe<Scalars['numeric']>;
  _gte?: InputMaybe<Scalars['numeric']>;
  _in?: InputMaybe<Array<Scalars['numeric']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['numeric']>;
  _lte?: InputMaybe<Scalars['numeric']>;
  _neq?: InputMaybe<Scalars['numeric']>;
  _nin?: InputMaybe<Array<Scalars['numeric']>>;
};

/** column ordering options */
export enum Order_By {
  /** in ascending order, nulls last */
  Asc = 'asc',
  /** in ascending order, nulls first */
  AscNullsFirst = 'asc_nulls_first',
  /** in ascending order, nulls last */
  AscNullsLast = 'asc_nulls_last',
  /** in descending order, nulls first */
  Desc = 'desc',
  /** in descending order, nulls first */
  DescNullsFirst = 'desc_nulls_first',
  /** in descending order, nulls last */
  DescNullsLast = 'desc_nulls_last'
}

export type Query_Root = {
  __typename?: 'query_root';
  /** execute function "available_jobs" which returns "job" */
  available_jobs: Array<Job>;
  /** fetch data from the table: "deck" */
  deck: Array<Deck>;
  /** fetch data from the table: "deck" using primary key columns */
  deck_by_pk?: Maybe<Deck>;
  /** fetch data from the table: "event" */
  event: Array<Event>;
  /** fetch aggregated fields from the table: "event" */
  event_aggregate: Event_Aggregate;
  /** fetch data from the table: "event" using primary key columns */
  event_by_pk?: Maybe<Event>;
  /** fetch data from the table: "file" */
  file: Array<File>;
  /** fetch data from the table: "file" using primary key columns */
  file_by_pk?: Maybe<File>;
  /** fetch data from the table: "file_upload" */
  file_upload: Array<File_Upload>;
  /** fetch data from the table: "file_upload" using primary key columns */
  file_upload_by_pk?: Maybe<File_Upload>;
  /** fetch data from the table: "job" */
  job: Array<Job>;
  /** fetch data from the table: "job" using primary key columns */
  job_by_pk?: Maybe<Job>;
  /** fetch data from the table: "track" */
  track: Array<Track>;
  /** fetch data from the table: "track" using primary key columns */
  track_by_pk?: Maybe<Track>;
  /** fetch data from the table: "workspace" */
  workspace: Array<Workspace>;
  /** fetch data from the table: "workspace" using primary key columns */
  workspace_by_pk?: Maybe<Workspace>;
};


export type Query_RootAvailable_JobsArgs = {
  distinct_on?: InputMaybe<Array<Job_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Job_Order_By>>;
  where?: InputMaybe<Job_Bool_Exp>;
};


export type Query_RootDeckArgs = {
  distinct_on?: InputMaybe<Array<Deck_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Deck_Order_By>>;
  where?: InputMaybe<Deck_Bool_Exp>;
};


export type Query_RootDeck_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootEventArgs = {
  distinct_on?: InputMaybe<Array<Event_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Event_Order_By>>;
  where?: InputMaybe<Event_Bool_Exp>;
};


export type Query_RootEvent_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Event_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Event_Order_By>>;
  where?: InputMaybe<Event_Bool_Exp>;
};


export type Query_RootEvent_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootFileArgs = {
  distinct_on?: InputMaybe<Array<File_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<File_Order_By>>;
  where?: InputMaybe<File_Bool_Exp>;
};


export type Query_RootFile_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootFile_UploadArgs = {
  distinct_on?: InputMaybe<Array<File_Upload_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<File_Upload_Order_By>>;
  where?: InputMaybe<File_Upload_Bool_Exp>;
};


export type Query_RootFile_Upload_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootJobArgs = {
  distinct_on?: InputMaybe<Array<Job_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Job_Order_By>>;
  where?: InputMaybe<Job_Bool_Exp>;
};


export type Query_RootJob_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootTrackArgs = {
  distinct_on?: InputMaybe<Array<Track_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Track_Order_By>>;
  where?: InputMaybe<Track_Bool_Exp>;
};


export type Query_RootTrack_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootWorkspaceArgs = {
  distinct_on?: InputMaybe<Array<Workspace_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Workspace_Order_By>>;
  where?: InputMaybe<Workspace_Bool_Exp>;
};


export type Query_RootWorkspace_By_PkArgs = {
  id: Scalars['uuid'];
};

export type Subscription_Root = {
  __typename?: 'subscription_root';
  /** execute function "available_jobs" which returns "job" */
  available_jobs: Array<Job>;
  /** fetch data from the table: "deck" */
  deck: Array<Deck>;
  /** fetch data from the table: "deck" using primary key columns */
  deck_by_pk?: Maybe<Deck>;
  /** fetch data from the table: "event" */
  event: Array<Event>;
  /** fetch aggregated fields from the table: "event" */
  event_aggregate: Event_Aggregate;
  /** fetch data from the table: "event" using primary key columns */
  event_by_pk?: Maybe<Event>;
  /** fetch data from the table: "file" */
  file: Array<File>;
  /** fetch data from the table: "file" using primary key columns */
  file_by_pk?: Maybe<File>;
  /** fetch data from the table: "file_upload" */
  file_upload: Array<File_Upload>;
  /** fetch data from the table: "file_upload" using primary key columns */
  file_upload_by_pk?: Maybe<File_Upload>;
  /** fetch data from the table: "job" */
  job: Array<Job>;
  /** fetch data from the table: "job" using primary key columns */
  job_by_pk?: Maybe<Job>;
  /** fetch data from the table: "track" */
  track: Array<Track>;
  /** fetch data from the table: "track" using primary key columns */
  track_by_pk?: Maybe<Track>;
  /** fetch data from the table: "workspace" */
  workspace: Array<Workspace>;
  /** fetch data from the table: "workspace" using primary key columns */
  workspace_by_pk?: Maybe<Workspace>;
};


export type Subscription_RootAvailable_JobsArgs = {
  distinct_on?: InputMaybe<Array<Job_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Job_Order_By>>;
  where?: InputMaybe<Job_Bool_Exp>;
};


export type Subscription_RootDeckArgs = {
  distinct_on?: InputMaybe<Array<Deck_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Deck_Order_By>>;
  where?: InputMaybe<Deck_Bool_Exp>;
};


export type Subscription_RootDeck_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootEventArgs = {
  distinct_on?: InputMaybe<Array<Event_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Event_Order_By>>;
  where?: InputMaybe<Event_Bool_Exp>;
};


export type Subscription_RootEvent_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Event_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Event_Order_By>>;
  where?: InputMaybe<Event_Bool_Exp>;
};


export type Subscription_RootEvent_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootFileArgs = {
  distinct_on?: InputMaybe<Array<File_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<File_Order_By>>;
  where?: InputMaybe<File_Bool_Exp>;
};


export type Subscription_RootFile_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootFile_UploadArgs = {
  distinct_on?: InputMaybe<Array<File_Upload_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<File_Upload_Order_By>>;
  where?: InputMaybe<File_Upload_Bool_Exp>;
};


export type Subscription_RootFile_Upload_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootJobArgs = {
  distinct_on?: InputMaybe<Array<Job_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Job_Order_By>>;
  where?: InputMaybe<Job_Bool_Exp>;
};


export type Subscription_RootJob_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootTrackArgs = {
  distinct_on?: InputMaybe<Array<Track_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Track_Order_By>>;
  where?: InputMaybe<Track_Bool_Exp>;
};


export type Subscription_RootTrack_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootWorkspaceArgs = {
  distinct_on?: InputMaybe<Array<Workspace_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Workspace_Order_By>>;
  where?: InputMaybe<Workspace_Bool_Exp>;
};


export type Subscription_RootWorkspace_By_PkArgs = {
  id: Scalars['uuid'];
};

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type Timestamptz_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['timestamptz']>;
  _gt?: InputMaybe<Scalars['timestamptz']>;
  _gte?: InputMaybe<Scalars['timestamptz']>;
  _in?: InputMaybe<Array<Scalars['timestamptz']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['timestamptz']>;
  _lte?: InputMaybe<Scalars['timestamptz']>;
  _neq?: InputMaybe<Scalars['timestamptz']>;
  _nin?: InputMaybe<Array<Scalars['timestamptz']>>;
};

/** columns and relationships of "track" */
export type Track = {
  __typename?: 'track';
  created_at: Scalars['timestamptz'];
  /** An object relationship */
  deck: Deck;
  deck_id: Scalars['uuid'];
  /** An object relationship */
  file: File;
  file_id: Scalars['uuid'];
  id: Scalars['uuid'];
  ordering: Scalars['bigint'];
};

/** order by aggregate values of table "track" */
export type Track_Aggregate_Order_By = {
  avg?: InputMaybe<Track_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Track_Max_Order_By>;
  min?: InputMaybe<Track_Min_Order_By>;
  stddev?: InputMaybe<Track_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Track_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Track_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Track_Sum_Order_By>;
  var_pop?: InputMaybe<Track_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Track_Var_Samp_Order_By>;
  variance?: InputMaybe<Track_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "track" */
export type Track_Arr_Rel_Insert_Input = {
  data: Array<Track_Insert_Input>;
};

/** order by avg() on columns of table "track" */
export type Track_Avg_Order_By = {
  ordering?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "track". All fields are combined with a logical 'AND'. */
export type Track_Bool_Exp = {
  _and?: InputMaybe<Array<Track_Bool_Exp>>;
  _not?: InputMaybe<Track_Bool_Exp>;
  _or?: InputMaybe<Array<Track_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  deck?: InputMaybe<Deck_Bool_Exp>;
  deck_id?: InputMaybe<Uuid_Comparison_Exp>;
  file?: InputMaybe<File_Bool_Exp>;
  file_id?: InputMaybe<Uuid_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  ordering?: InputMaybe<Bigint_Comparison_Exp>;
};

/** input type for inserting data into table "track" */
export type Track_Insert_Input = {
  deck?: InputMaybe<Deck_Obj_Rel_Insert_Input>;
  deck_id?: InputMaybe<Scalars['uuid']>;
  file_id?: InputMaybe<Scalars['uuid']>;
  id?: InputMaybe<Scalars['uuid']>;
  ordering?: InputMaybe<Scalars['bigint']>;
};

/** order by max() on columns of table "track" */
export type Track_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  deck_id?: InputMaybe<Order_By>;
  file_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  ordering?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "track" */
export type Track_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  deck_id?: InputMaybe<Order_By>;
  file_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  ordering?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "track" */
export type Track_Mutation_Response = {
  __typename?: 'track_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Track>;
};

/** Ordering options when selecting data from "track". */
export type Track_Order_By = {
  created_at?: InputMaybe<Order_By>;
  deck?: InputMaybe<Deck_Order_By>;
  deck_id?: InputMaybe<Order_By>;
  file?: InputMaybe<File_Order_By>;
  file_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  ordering?: InputMaybe<Order_By>;
};

/** select columns of table "track" */
export enum Track_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DeckId = 'deck_id',
  /** column name */
  FileId = 'file_id',
  /** column name */
  Id = 'id',
  /** column name */
  Ordering = 'ordering'
}

/** order by stddev() on columns of table "track" */
export type Track_Stddev_Order_By = {
  ordering?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "track" */
export type Track_Stddev_Pop_Order_By = {
  ordering?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "track" */
export type Track_Stddev_Samp_Order_By = {
  ordering?: InputMaybe<Order_By>;
};

/** order by sum() on columns of table "track" */
export type Track_Sum_Order_By = {
  ordering?: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "track" */
export type Track_Var_Pop_Order_By = {
  ordering?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "track" */
export type Track_Var_Samp_Order_By = {
  ordering?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "track" */
export type Track_Variance_Order_By = {
  ordering?: InputMaybe<Order_By>;
};

/** Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'. */
export type Uuid_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['uuid']>;
  _gt?: InputMaybe<Scalars['uuid']>;
  _gte?: InputMaybe<Scalars['uuid']>;
  _in?: InputMaybe<Array<Scalars['uuid']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['uuid']>;
  _lte?: InputMaybe<Scalars['uuid']>;
  _neq?: InputMaybe<Scalars['uuid']>;
  _nin?: InputMaybe<Array<Scalars['uuid']>>;
};

/** columns and relationships of "workspace" */
export type Workspace = {
  __typename?: 'workspace';
  created_at: Scalars['timestamptz'];
  /** An array relationship */
  decks: Array<Deck>;
  /** An array relationship */
  files: Array<File>;
  id: Scalars['uuid'];
  /** An array relationship */
  jobs: Array<Job>;
  name: Scalars['String'];
  updated_at: Scalars['timestamptz'];
};


/** columns and relationships of "workspace" */
export type WorkspaceDecksArgs = {
  distinct_on?: InputMaybe<Array<Deck_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Deck_Order_By>>;
  where?: InputMaybe<Deck_Bool_Exp>;
};


/** columns and relationships of "workspace" */
export type WorkspaceFilesArgs = {
  distinct_on?: InputMaybe<Array<File_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<File_Order_By>>;
  where?: InputMaybe<File_Bool_Exp>;
};


/** columns and relationships of "workspace" */
export type WorkspaceJobsArgs = {
  distinct_on?: InputMaybe<Array<Job_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Job_Order_By>>;
  where?: InputMaybe<Job_Bool_Exp>;
};

/** Boolean expression to filter rows from the table "workspace". All fields are combined with a logical 'AND'. */
export type Workspace_Bool_Exp = {
  _and?: InputMaybe<Array<Workspace_Bool_Exp>>;
  _not?: InputMaybe<Workspace_Bool_Exp>;
  _or?: InputMaybe<Array<Workspace_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  decks?: InputMaybe<Deck_Bool_Exp>;
  files?: InputMaybe<File_Bool_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  jobs?: InputMaybe<Job_Bool_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "workspace" */
export enum Workspace_Constraint {
  /** unique or primary key constraint */
  WorkspacePkey = 'workspace_pkey'
}

/** input type for inserting data into table "workspace" */
export type Workspace_Insert_Input = {
  decks?: InputMaybe<Deck_Arr_Rel_Insert_Input>;
  jobs?: InputMaybe<Job_Arr_Rel_Insert_Input>;
  name?: InputMaybe<Scalars['String']>;
};

/** response of any mutation on the table "workspace" */
export type Workspace_Mutation_Response = {
  __typename?: 'workspace_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Workspace>;
};

/** input type for inserting object relation for remote table "workspace" */
export type Workspace_Obj_Rel_Insert_Input = {
  data: Workspace_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Workspace_On_Conflict>;
};

/** on_conflict condition type for table "workspace" */
export type Workspace_On_Conflict = {
  constraint: Workspace_Constraint;
  update_columns?: Array<Workspace_Update_Column>;
  where?: InputMaybe<Workspace_Bool_Exp>;
};

/** Ordering options when selecting data from "workspace". */
export type Workspace_Order_By = {
  created_at?: InputMaybe<Order_By>;
  decks_aggregate?: InputMaybe<Deck_Aggregate_Order_By>;
  files_aggregate?: InputMaybe<File_Aggregate_Order_By>;
  id?: InputMaybe<Order_By>;
  jobs_aggregate?: InputMaybe<Job_Aggregate_Order_By>;
  name?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: workspace */
export type Workspace_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "workspace" */
export enum Workspace_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "workspace" */
export type Workspace_Set_Input = {
  name?: InputMaybe<Scalars['String']>;
};

/** update columns of table "workspace" */
export enum Workspace_Update_Column {
  /** column name */
  Name = 'name'
}

export type TrackInfoFragment = { __typename?: 'track', id: string, created_at: string, deck_id: string, ordering: number, file: { __typename?: 'file', id: string, type: File_Type_Enum_Enum, path: any, name: string, description: string, length: number, ordering?: number | null, workspace_id: string, download_url: string } };

export type DeckInfoFragment = { __typename?: 'deck', id: string, type: Deck_Type_Enum_Enum, volume: number, speed: number, pause_timestamp?: string | null, start_timestamp: string, workspace_id: string, created_at: string, queue: Array<{ __typename?: 'track', id: string, created_at: string, deck_id: string, ordering: number, file: { __typename?: 'file', id: string, type: File_Type_Enum_Enum, path: any, name: string, description: string, length: number, ordering?: number | null, workspace_id: string, download_url: string } }> };

export type DecksQueryVariables = Exact<{
  workspaceId: Scalars['uuid'];
}>;


export type DecksQuery = { __typename?: 'query_root', workspace_by_pk?: { __typename?: 'workspace', id: string, decks: Array<{ __typename?: 'deck', id: string, type: Deck_Type_Enum_Enum, volume: number, speed: number, pause_timestamp?: string | null, start_timestamp: string, workspace_id: string, created_at: string, queue: Array<{ __typename?: 'track', id: string, created_at: string, deck_id: string, ordering: number, file: { __typename?: 'file', id: string, type: File_Type_Enum_Enum, path: any, name: string, description: string, length: number, ordering?: number | null, workspace_id: string, download_url: string } }> }> } | null };

export type StopDeckMutationVariables = Exact<{
  deckId: Scalars['uuid'];
}>;


export type StopDeckMutation = { __typename?: 'mutation_root', delete_deck_by_pk?: { __typename?: 'deck', id: string, workspace_id: string } | null };

export type UpdateDeckMutationVariables = Exact<{
  deckId: Scalars['uuid'];
  update: Deck_Set_Input;
}>;


export type UpdateDeckMutation = { __typename?: 'mutation_root', update_deck_by_pk?: { __typename?: 'deck', id: string, type: Deck_Type_Enum_Enum, volume: number, speed: number, pause_timestamp?: string | null, start_timestamp: string, workspace_id: string, created_at: string, queue: Array<{ __typename?: 'track', id: string, created_at: string, deck_id: string, ordering: number, file: { __typename?: 'file', id: string, type: File_Type_Enum_Enum, path: any, name: string, description: string, length: number, ordering?: number | null, workspace_id: string, download_url: string } }> } | null };

export type PlayDeckMutationVariables = Exact<{
  workspaceId: Scalars['uuid'];
  deck: Deck_Insert_Input;
  isMain?: Scalars['Boolean'];
}>;


export type PlayDeckMutation = { __typename?: 'mutation_root', delete_track?: { __typename?: 'track_mutation_response', affected_rows: number, returning: Array<{ __typename?: 'track', id: string }> } | null, insert_deck_one?: { __typename?: 'deck', id: string, type: Deck_Type_Enum_Enum, volume: number, speed: number, pause_timestamp?: string | null, start_timestamp: string, workspace_id: string, created_at: string, queue: Array<{ __typename?: 'track', id: string, created_at: string, deck_id: string, ordering: number, file: { __typename?: 'file', id: string, type: File_Type_Enum_Enum, path: any, name: string, description: string, length: number, ordering?: number | null, workspace_id: string, download_url: string } }> } | null };

export type SetQueueMutationVariables = Exact<{
  deckId: Scalars['uuid'];
  newQueue: Array<Track_Insert_Input> | Track_Insert_Input;
  dummy: Scalars['timestamptz'];
}>;


export type SetQueueMutation = { __typename?: 'mutation_root', delete_track?: { __typename?: 'track_mutation_response', affected_rows: number } | null, insert_track?: { __typename?: 'track_mutation_response', affected_rows: number } | null, update_deck_by_pk?: { __typename?: 'deck', id: string, type: Deck_Type_Enum_Enum, volume: number, speed: number, pause_timestamp?: string | null, start_timestamp: string, workspace_id: string, created_at: string, queue: Array<{ __typename?: 'track', id: string, created_at: string, deck_id: string, ordering: number, file: { __typename?: 'file', id: string, type: File_Type_Enum_Enum, path: any, name: string, description: string, length: number, ordering?: number | null, workspace_id: string, download_url: string } }> } | null };

export type DeckEventsSubscriptionVariables = Exact<{
  workspaceId: Scalars['uuid'];
}>;


export type DeckEventsSubscription = { __typename?: 'subscription_root', event: Array<{ __typename: 'event', id: string, workspace_id?: string | null, time: string, event_type: string, workspace?: { __typename: 'workspace', id: string, created_at: string, updated_at: string, name: string, decks: Array<{ __typename: 'deck', id: string, type: Deck_Type_Enum_Enum, volume: number, speed: number, pause_timestamp?: string | null, start_timestamp: string, workspace_id: string, created_at: string, queue: Array<{ __typename?: 'track', id: string, created_at: string, deck_id: string, ordering: number, file: { __typename?: 'file', id: string, type: File_Type_Enum_Enum, path: any, name: string, description: string, length: number, ordering?: number | null, workspace_id: string, download_url: string } }> }> } | null }> };

export type FileEventsSubscriptionVariables = Exact<{
  workspaceId: Scalars['uuid'];
}>;


export type FileEventsSubscription = { __typename?: 'subscription_root', event: Array<{ __typename: 'event', id: string, workspace_id?: string | null, time: string, event_type: string, workspace?: { __typename: 'workspace', id: string, created_at: string, updated_at: string, name: string, files: Array<{ __typename: 'file', id: string, type: File_Type_Enum_Enum, path: any, name: string, description: string, length: number, ordering?: number | null, workspace_id: string, download_url: string }> } | null }> };

export type FileInfoFragment = { __typename?: 'file', id: string, type: File_Type_Enum_Enum, path: any, name: string, description: string, length: number, ordering?: number | null, workspace_id: string, download_url: string };

export type WorkspaceFilesQueryVariables = Exact<{
  workspaceId: Scalars['uuid'];
}>;


export type WorkspaceFilesQuery = { __typename?: 'query_root', file: Array<{ __typename?: 'file', id: string, type: File_Type_Enum_Enum, path: any, name: string, description: string, length: number, ordering?: number | null, workspace_id: string, download_url: string }> };

export type UpdateFileMutationVariables = Exact<{
  id: Scalars['uuid'];
  update: File_Set_Input;
}>;


export type UpdateFileMutation = { __typename?: 'mutation_root', update_file_by_pk?: { __typename?: 'file', id: string, type: File_Type_Enum_Enum, path: any, name: string, description: string, length: number, ordering?: number | null, workspace_id: string, download_url: string } | null };

export type DeleteFileMutationVariables = Exact<{
  job: Delete_Job_Insert_Input;
}>;


export type DeleteFileMutation = { __typename?: 'mutation_root', insert_delete_job?: { __typename?: 'delete_job_mutation_response', affected_rows: number } | null };

export type SetFilesPathMutationVariables = Exact<{
  files: Array<Scalars['uuid']> | Scalars['uuid'];
  path?: InputMaybe<Scalars['jsonb']>;
}>;


export type SetFilesPathMutation = { __typename?: 'mutation_root', update_file?: { __typename?: 'file_mutation_response', affected_rows: number, returning: Array<{ __typename?: 'file', id: string, type: File_Type_Enum_Enum, path: any, name: string, description: string, length: number, ordering?: number | null, workspace_id: string, download_url: string }> } | null };

export type JobInfoFragment = { __typename?: 'job', id: string, url?: string | null, name: string, description: string, path: any, option_cut_start?: unknown | null, option_cut_end?: unknown | null, option_fade_in?: unknown | null, option_fade_out?: unknown | null, progress?: number | null, status: Job_Status_Enum_Enum, assigned_worker?: string | null, error?: string | null, created_at: string };

export type WorkspaceJobsSubscriptionVariables = Exact<{
  workspaceId: Scalars['uuid'];
}>;


export type WorkspaceJobsSubscription = { __typename?: 'subscription_root', job: Array<{ __typename?: 'job', id: string, url?: string | null, name: string, description: string, path: any, option_cut_start?: unknown | null, option_cut_end?: unknown | null, option_fade_in?: unknown | null, option_fade_out?: unknown | null, progress?: number | null, status: Job_Status_Enum_Enum, assigned_worker?: string | null, error?: string | null, created_at: string }> };

export type AddJobMutationVariables = Exact<{
  job: Job_Insert_Input;
}>;


export type AddJobMutation = { __typename?: 'mutation_root', insert_job_one?: { __typename?: 'job', id: string, url?: string | null, name: string, description: string, path: any, option_cut_start?: unknown | null, option_cut_end?: unknown | null, option_fade_in?: unknown | null, option_fade_out?: unknown | null, progress?: number | null, status: Job_Status_Enum_Enum, assigned_worker?: string | null, error?: string | null, created_at: string } | null };

export type DeleteErrorJobMutationVariables = Exact<{
  jobId: Scalars['uuid'];
}>;


export type DeleteErrorJobMutation = { __typename?: 'mutation_root', delete_job_by_pk?: { __typename?: 'job', id: string } | null };

export type WorkspaceInfoFragment = { __typename?: 'workspace', id: string, name: string, created_at: string, updated_at: string };

export type WorkspaceDetailQueryVariables = Exact<{
  workspaceId: Scalars['uuid'];
}>;


export type WorkspaceDetailQuery = { __typename?: 'query_root', workspace_by_pk?: { __typename?: 'workspace', id: string, name: string, created_at: string, updated_at: string } | null };

export type WorkspaceDetailByNameQueryVariables = Exact<{
  workspaceName: Scalars['String'];
}>;


export type WorkspaceDetailByNameQuery = { __typename?: 'query_root', workspace: Array<{ __typename?: 'workspace', id: string, name: string, created_at: string, updated_at: string }> };

export type CreateWorkspaceMutationVariables = Exact<{
  name?: InputMaybe<Scalars['String']>;
}>;


export type CreateWorkspaceMutation = { __typename?: 'mutation_root', insert_workspace_one?: { __typename?: 'workspace', id: string, name: string, created_at: string, updated_at: string } | null };

export const FileInfoFragmentDoc = gql`
    fragment FileInfo on file {
  id
  type
  path
  name
  description
  length
  ordering
  workspace_id
  download_url
}
    `;
export const TrackInfoFragmentDoc = gql`
    fragment TrackInfo on track {
  id
  created_at
  file {
    ...FileInfo
  }
  deck_id
  ordering
}
    ${FileInfoFragmentDoc}`;
export const DeckInfoFragmentDoc = gql`
    fragment DeckInfo on deck {
  id
  type
  volume
  speed
  pause_timestamp
  start_timestamp
  queue {
    ...TrackInfo
  }
  workspace_id
  created_at
}
    ${TrackInfoFragmentDoc}`;
export const JobInfoFragmentDoc = gql`
    fragment JobInfo on job {
  id
  url
  name
  description
  path
  option_cut_start
  option_cut_end
  option_fade_in
  option_fade_out
  progress
  status
  assigned_worker
  error
  created_at
}
    `;
export const WorkspaceInfoFragmentDoc = gql`
    fragment WorkspaceInfo on workspace {
  id
  name
  created_at
  updated_at
}
    `;
export const DecksDocument = gql`
    query Decks($workspaceId: uuid!) {
  workspace_by_pk(id: $workspaceId) {
    id
    decks {
      ...DeckInfo
    }
  }
}
    ${DeckInfoFragmentDoc}`;

export function useDecksQuery(options: Omit<Urql.UseQueryArgs<DecksQueryVariables>, 'query'>) {
  return Urql.useQuery<DecksQuery>({ query: DecksDocument, ...options });
};
export const StopDeckDocument = gql`
    mutation StopDeck($deckId: uuid!) {
  delete_deck_by_pk(id: $deckId) {
    id
    workspace_id
  }
}
    `;

export function useStopDeckMutation() {
  return Urql.useMutation<StopDeckMutation, StopDeckMutationVariables>(StopDeckDocument);
};
export const UpdateDeckDocument = gql`
    mutation UpdateDeck($deckId: uuid!, $update: deck_set_input!) {
  update_deck_by_pk(pk_columns: {id: $deckId}, _set: $update) {
    ...DeckInfo
  }
}
    ${DeckInfoFragmentDoc}`;

export function useUpdateDeckMutation() {
  return Urql.useMutation<UpdateDeckMutation, UpdateDeckMutationVariables>(UpdateDeckDocument);
};
export const PlayDeckDocument = gql`
    mutation PlayDeck($workspaceId: uuid!, $deck: deck_insert_input!, $isMain: Boolean! = false) {
  delete_track(
    where: {deck: {workspace_id: {_eq: $workspaceId}, type: {_eq: main}}}
  ) @include(if: $isMain) {
    affected_rows
    returning {
      id
    }
  }
  insert_deck_one(object: $deck) {
    ...DeckInfo
  }
}
    ${DeckInfoFragmentDoc}`;

export function usePlayDeckMutation() {
  return Urql.useMutation<PlayDeckMutation, PlayDeckMutationVariables>(PlayDeckDocument);
};
export const SetQueueDocument = gql`
    mutation SetQueue($deckId: uuid!, $newQueue: [track_insert_input!]!, $dummy: timestamptz!) {
  delete_track(where: {deck: {id: {_eq: $deckId}}}) {
    affected_rows
  }
  insert_track(objects: $newQueue) {
    affected_rows
  }
  update_deck_by_pk(
    pk_columns: {id: $deckId}
    _set: {start_timestamp: now, dummy: $dummy}
  ) {
    ...DeckInfo
  }
}
    ${DeckInfoFragmentDoc}`;

export function useSetQueueMutation() {
  return Urql.useMutation<SetQueueMutation, SetQueueMutationVariables>(SetQueueDocument);
};
export const DeckEventsDocument = gql`
    subscription DeckEvents($workspaceId: uuid!) {
  event(
    where: {workspace_id: {_eq: $workspaceId}, event_type: {_in: ["deck", "track"]}}
    limit: 1
    order_by: [{time: desc}]
  ) {
    __typename
    id
    workspace_id
    time
    event_type
    workspace {
      __typename
      id
      created_at
      updated_at
      name
      decks {
        __typename
        ...DeckInfo
      }
    }
  }
}
    ${DeckInfoFragmentDoc}`;

export function useDeckEventsSubscription<TData = DeckEventsSubscription>(options: Omit<Urql.UseSubscriptionArgs<DeckEventsSubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandler<DeckEventsSubscription, TData>) {
  return Urql.useSubscription<DeckEventsSubscription, TData, DeckEventsSubscriptionVariables>({ query: DeckEventsDocument, ...options }, handler);
};
export const FileEventsDocument = gql`
    subscription FileEvents($workspaceId: uuid!) {
  event(
    where: {workspace_id: {_eq: $workspaceId}, event_type: {_eq: "file"}}
    limit: 1
    order_by: [{time: desc}]
  ) {
    __typename
    id
    workspace_id
    time
    event_type
    workspace {
      __typename
      id
      created_at
      updated_at
      name
      files {
        __typename
        ...FileInfo
      }
    }
  }
}
    ${FileInfoFragmentDoc}`;

export function useFileEventsSubscription<TData = FileEventsSubscription>(options: Omit<Urql.UseSubscriptionArgs<FileEventsSubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandler<FileEventsSubscription, TData>) {
  return Urql.useSubscription<FileEventsSubscription, TData, FileEventsSubscriptionVariables>({ query: FileEventsDocument, ...options }, handler);
};
export const WorkspaceFilesDocument = gql`
    query WorkspaceFiles($workspaceId: uuid!) {
  file(
    where: {workspace_id: {_eq: $workspaceId}}
    order_by: [{ordering: asc_nulls_last}]
  ) {
    ...FileInfo
  }
}
    ${FileInfoFragmentDoc}`;

export function useWorkspaceFilesQuery(options: Omit<Urql.UseQueryArgs<WorkspaceFilesQueryVariables>, 'query'>) {
  return Urql.useQuery<WorkspaceFilesQuery>({ query: WorkspaceFilesDocument, ...options });
};
export const UpdateFileDocument = gql`
    mutation UpdateFile($id: uuid!, $update: file_set_input!) {
  update_file_by_pk(_set: $update, pk_columns: {id: $id}) {
    ...FileInfo
  }
}
    ${FileInfoFragmentDoc}`;

export function useUpdateFileMutation() {
  return Urql.useMutation<UpdateFileMutation, UpdateFileMutationVariables>(UpdateFileDocument);
};
export const DeleteFileDocument = gql`
    mutation DeleteFile($job: delete_job_insert_input!) {
  insert_delete_job(objects: [$job]) {
    affected_rows
  }
}
    `;

export function useDeleteFileMutation() {
  return Urql.useMutation<DeleteFileMutation, DeleteFileMutationVariables>(DeleteFileDocument);
};
export const SetFilesPathDocument = gql`
    mutation SetFilesPath($files: [uuid!]!, $path: jsonb) {
  update_file(where: {id: {_in: $files}}, _set: {path: $path}) {
    affected_rows
    returning {
      ...FileInfo
    }
  }
}
    ${FileInfoFragmentDoc}`;

export function useSetFilesPathMutation() {
  return Urql.useMutation<SetFilesPathMutation, SetFilesPathMutationVariables>(SetFilesPathDocument);
};
export const WorkspaceJobsDocument = gql`
    subscription WorkspaceJobs($workspaceId: uuid!) {
  job(
    where: {workspace_id: {_eq: $workspaceId}}
    order_by: [{assign_time: asc}, {created_at: asc}]
  ) {
    ...JobInfo
  }
}
    ${JobInfoFragmentDoc}`;

export function useWorkspaceJobsSubscription<TData = WorkspaceJobsSubscription>(options: Omit<Urql.UseSubscriptionArgs<WorkspaceJobsSubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandler<WorkspaceJobsSubscription, TData>) {
  return Urql.useSubscription<WorkspaceJobsSubscription, TData, WorkspaceJobsSubscriptionVariables>({ query: WorkspaceJobsDocument, ...options }, handler);
};
export const AddJobDocument = gql`
    mutation AddJob($job: job_insert_input!) {
  insert_job_one(object: $job) {
    ...JobInfo
  }
}
    ${JobInfoFragmentDoc}`;

export function useAddJobMutation() {
  return Urql.useMutation<AddJobMutation, AddJobMutationVariables>(AddJobDocument);
};
export const DeleteErrorJobDocument = gql`
    mutation DeleteErrorJob($jobId: uuid!) {
  delete_job_by_pk(id: $jobId) {
    id
  }
}
    `;

export function useDeleteErrorJobMutation() {
  return Urql.useMutation<DeleteErrorJobMutation, DeleteErrorJobMutationVariables>(DeleteErrorJobDocument);
};
export const WorkspaceDetailDocument = gql`
    query WorkspaceDetail($workspaceId: uuid!) {
  workspace_by_pk(id: $workspaceId) {
    ...WorkspaceInfo
  }
}
    ${WorkspaceInfoFragmentDoc}`;

export function useWorkspaceDetailQuery(options: Omit<Urql.UseQueryArgs<WorkspaceDetailQueryVariables>, 'query'>) {
  return Urql.useQuery<WorkspaceDetailQuery>({ query: WorkspaceDetailDocument, ...options });
};
export const WorkspaceDetailByNameDocument = gql`
    query WorkspaceDetailByName($workspaceName: String!) {
  workspace(where: {name: {_eq: $workspaceName}}, limit: 1) {
    ...WorkspaceInfo
  }
}
    ${WorkspaceInfoFragmentDoc}`;

export function useWorkspaceDetailByNameQuery(options: Omit<Urql.UseQueryArgs<WorkspaceDetailByNameQueryVariables>, 'query'>) {
  return Urql.useQuery<WorkspaceDetailByNameQuery>({ query: WorkspaceDetailByNameDocument, ...options });
};
export const CreateWorkspaceDocument = gql`
    mutation CreateWorkspace($name: String) {
  insert_workspace_one(object: {name: $name}) {
    ...WorkspaceInfo
  }
}
    ${WorkspaceInfoFragmentDoc}`;

export function useCreateWorkspaceMutation() {
  return Urql.useMutation<CreateWorkspaceMutation, CreateWorkspaceMutationVariables>(CreateWorkspaceDocument);
};