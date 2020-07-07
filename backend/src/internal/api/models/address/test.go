package address

import ()

type TestSubmitter struct{}

func (p TestSubmitter) Submit(request *Request) (*Result, error) {
	result := &Result{
		Candidates: []Candidate{
			Candidate{
				Address:    "123 Fake St, Apt A, Atlanta GA, 30303",
				Location:   Location{X: 1.2, Y: 3.4, Z: 1, M: 0},
				Attributes: Attributes{Score: 100.0, Ref_ID: 1},
			},
		},
	}

	return result, nil
}
