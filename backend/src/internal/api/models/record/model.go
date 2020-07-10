package record

import ()

type Submitter interface {
	Submit(r *Request) (*Result, error)
}

type Request struct {
	Ref_ID int
}

type Record struct {
	COUNCIL_DIST string
	NPU_NAME     string
}

type Result []Record
