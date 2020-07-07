package record

import ()

type TestSubmitter struct{}

func (s TestSubmitter) Submit(request *Request) (*Result, error) {
	return &Result{Record{COUNCIL_DIST: "1"}}, nil
}
