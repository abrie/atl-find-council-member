package censusgeocoder

import ()

type Submitter interface {
	Submit(r *Request) (*Result, error)
}

type Request struct {
	Address Address `json:"address"`
}

type Address struct {
	Street string `json:"street"`
	City   string `json:"city"`
	State  string `json:"state"`
}

type Result struct {
	AddressMatches []AddressMatch `json:"addressMatches"`
	Errors         []Error        `json:"errors"`
}

type AddressMatch struct {
	MatchedAddress MatchedAddress `json:"matchedAddress"`
	Coordinates    Coordinates    `json:"coordinates"`
}

type MatchedAddress string

type Coordinates struct {
	X float64 `json:"x"`
	Y float64 `json:"y"`
}

type Error string
