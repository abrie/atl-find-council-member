package address

import ()

type Submitter interface {
	Submit(r *Request) (*Result, error)
}

type Request struct {
	Address string
}

type Result struct {
	Candidates []Candidate `json:"candidates"`
}

type Address string

type Location struct {
	X float64 `json:"x"`
	Y float64 `json:"y"`
	Z float64 `json:"z"`
	M float64 `json:"m"`
}

type Attributes struct {
	Score  float64 `json:"score"`
	Ref_ID int     `json:"Ref_ID"`
}

type Candidate struct {
	Address    Address    `json:"address"`
	Location   Location   `json:"location"`
	Attributes Attributes `json:"attributes"`
}
